from __future__ import annotations

import time
import uuid
from typing import Any


def chat_completions_to_responses(payload: dict[str, Any]) -> dict[str, Any]:
    messages = payload.get("messages")
    if not isinstance(messages, list) or not messages:
        raise ValueError("messages must be a non-empty list")

    responses_payload: dict[str, Any] = {
        "model": payload.get("model", "openai/responses"),
        "input": _convert_messages(messages),
    }

    if "instructions" in payload:
        responses_payload["instructions"] = payload["instructions"]
    if "temperature" in payload:
        responses_payload["temperature"] = payload["temperature"]
    if "top_p" in payload:
        responses_payload["top_p"] = payload["top_p"]
    if "stream" in payload:
        responses_payload["stream"] = payload["stream"]

    max_output_tokens = payload.get("max_completion_tokens", payload.get("max_tokens"))
    if max_output_tokens is not None:
        responses_payload["max_output_tokens"] = max_output_tokens

    reasoning_effort = payload.get("reasoning_effort")
    if reasoning_effort:
        responses_payload["reasoning"] = {
            "effort": reasoning_effort,
            "summary": "auto",
        }

    tools = payload.get("tools")
    if isinstance(tools, list) and tools:
        responses_payload["tools"] = _convert_tools(tools)

    tool_choice = payload.get("tool_choice")
    if tool_choice is not None:
        responses_payload["tool_choice"] = _convert_tool_choice(tool_choice)

    return responses_payload


def responses_to_chat_completions(payload: dict[str, Any], *, fallback_model: str) -> dict[str, Any]:
    content_text = ""
    tool_calls: list[dict[str, Any]] = []
    reasoning_text = ""

    for item in payload.get("output", []):
        if not isinstance(item, dict):
            continue
        item_type = item.get("type")
        if item_type == "message":
            for part in item.get("content", []):
                if not isinstance(part, dict):
                    continue
                if part.get("type") == "output_text" and isinstance(part.get("text"), str):
                    content_text += part["text"]
        elif item_type == "function_call":
            tool_calls.append(
                {
                    "id": item.get("call_id") or f"call_{uuid.uuid4().hex[:10]}",
                    "type": "function",
                    "function": {
                        "name": item.get("name", ""),
                        "arguments": item.get("arguments", "{}"),
                    },
                }
            )
        elif item_type == "reasoning":
            for part in item.get("summary", []):
                if not isinstance(part, dict):
                    continue
                if part.get("type") == "summary_text" and isinstance(part.get("text"), str):
                    reasoning_text += part["text"]

    message: dict[str, Any] = {"role": "assistant"}
    if tool_calls:
        message["tool_calls"] = tool_calls
    if content_text:
        message["content"] = content_text
    else:
        message["content"] = None
    if reasoning_text:
        message["reasoning_content"] = reasoning_text

    finish_reason = "tool_calls" if tool_calls else "stop"
    incomplete_details = payload.get("incomplete_details") or {}
    if payload.get("status") == "incomplete" and incomplete_details.get("reason") == "max_output_tokens":
        finish_reason = "length"

    response: dict[str, Any] = {
        "id": payload.get("id") or f"chatcmpl_{uuid.uuid4().hex}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": payload.get("model") or fallback_model,
        "choices": [
            {
                "index": 0,
                "message": message,
                "finish_reason": finish_reason,
            }
        ],
    }

    usage = payload.get("usage")
    if isinstance(usage, dict):
        input_tokens = int(usage.get("input_tokens") or 0)
        output_tokens = int(usage.get("output_tokens") or 0)
        usage_payload: dict[str, Any] = {
            "prompt_tokens": input_tokens,
            "completion_tokens": output_tokens,
            "total_tokens": input_tokens + output_tokens,
        }
        input_token_details = usage.get("input_tokens_details")
        if isinstance(input_token_details, dict) and input_token_details.get("cached_tokens"):
            usage_payload["prompt_tokens_details"] = {
                "cached_tokens": input_token_details["cached_tokens"]
            }
        response["usage"] = usage_payload

    return response


def _convert_messages(messages: list[Any]) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for message in messages:
        if not isinstance(message, dict):
            continue
        role = message.get("role", "user")
        content = message.get("content")

        if role in {"system", "developer", "user"}:
            items.append(
                {
                    "role": "system" if role == "system" else "user",
                    "content": _convert_content_parts(content, assistant=False),
                }
            )
            continue

        if role == "assistant":
            assistant_content = _convert_content_parts(content, assistant=True)
            if assistant_content:
                items.append(
                    {
                        "role": "assistant",
                        "content": assistant_content,
                    }
                )
            for tool_call in message.get("tool_calls", []):
                if not isinstance(tool_call, dict):
                    continue
                function = tool_call.get("function") or {}
                items.append(
                    {
                        "type": "function_call",
                        "call_id": tool_call.get("id"),
                        "name": function.get("name", ""),
                        "arguments": function.get("arguments", "{}"),
                    }
                )
            continue

        if role == "tool":
            items.append(
                {
                    "type": "function_call_output",
                    "call_id": message.get("tool_call_id"),
                    "output": _stringify_content(content),
                }
            )
            continue

        items.append({"role": "user", "content": _convert_content_parts(content, assistant=False)})

    return items


def _convert_content_parts(content: Any, *, assistant: bool) -> list[dict[str, Any]]:
    text_type = "output_text" if assistant else "input_text"
    if isinstance(content, str):
        return [{"type": text_type, "text": content}]
    if content is None:
        return []
    if isinstance(content, list):
        parts: list[dict[str, Any]] = []
        for item in content:
            if isinstance(item, str):
                parts.append({"type": text_type, "text": item})
                continue
            if not isinstance(item, dict):
                continue
            item_type = item.get("type")
            if item_type == "text" and isinstance(item.get("text"), str):
                parts.append({"type": text_type, "text": item["text"]})
            elif item_type == "image_url":
                image_url = item.get("image_url")
                if isinstance(image_url, dict):
                    url = image_url.get("url")
                else:
                    url = image_url
                if isinstance(url, str) and url:
                    parts.append({"type": "input_image", "image_url": url})
            elif item_type in {"input_text", "output_text"} and isinstance(item.get("text"), str):
                parts.append({"type": item_type, "text": item["text"]})
        return parts
    return [{"type": text_type, "text": _stringify_content(content)}]


def _convert_tools(tools: list[Any]) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    for tool in tools:
        if not isinstance(tool, dict):
            continue
        if tool.get("type") != "function":
            continue
        function = tool.get("function") or {}
        result.append(
            {
                "type": "function",
                "name": function.get("name", ""),
                "description": function.get("description"),
                "parameters": function.get("parameters") or {},
            }
        )
    return result


def _convert_tool_choice(tool_choice: Any) -> Any:
    if isinstance(tool_choice, str):
        return tool_choice
    if not isinstance(tool_choice, dict):
        return tool_choice
    if tool_choice.get("type") == "function":
        function = tool_choice.get("function") or {}
        return {
            "type": "function",
            "name": function.get("name", ""),
        }
    return tool_choice


def _stringify_content(content: Any) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict) and isinstance(item.get("text"), str):
                parts.append(item["text"])
        return "".join(parts)
    return str(content)
