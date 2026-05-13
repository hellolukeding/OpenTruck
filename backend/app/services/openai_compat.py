from __future__ import annotations

import json
import time
import uuid
from dataclasses import dataclass, field
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


@dataclass
class ChatCompletionsStreamState:
    id: str = field(default_factory=lambda: f"chatcmpl_{uuid.uuid4().hex}")
    created: int = field(default_factory=lambda: int(time.time()))
    model: str = ""
    sent_role: bool = False
    saw_text: bool = False
    saw_reasoning: bool = False
    saw_refusal: bool = False
    saw_tool_call: bool = False
    finalized: bool = False
    next_tool_call_index: int = 0
    output_index_to_tool_index: dict[int, int] = field(default_factory=dict)
    output_indices_with_tool_args: set[int] = field(default_factory=set)
    include_usage: bool = False
    usage: dict[str, Any] | None = None


def responses_event_to_chat_chunks(
    event_type: str,
    event_payload: dict[str, Any],
    *,
    state: ChatCompletionsStreamState,
) -> list[dict[str, Any]]:
    if event_type == "response.created":
        response = event_payload.get("response") or {}
        if response.get("id"):
            state.id = response["id"]
        if response.get("model"):
            state.model = response["model"]
        if state.sent_role:
            return []
        state.sent_role = True
        return [_make_chat_delta_chunk(state=state, delta={"role": "assistant"})]

    if event_type == "response.output_text.delta":
        delta = event_payload.get("delta")
        if not isinstance(delta, str) or not delta:
            return []
        state.saw_text = True
        if not state.sent_role:
            state.sent_role = True
            return [
                _make_chat_delta_chunk(state=state, delta={"role": "assistant"}),
                _make_chat_delta_chunk(state=state, delta={"content": delta}),
            ]
        return [_make_chat_delta_chunk(state=state, delta={"content": delta})]

    if event_type == "response.output_text.done":
        text = event_payload.get("text")
        if not isinstance(text, str) or not text or state.saw_text:
            return []
        state.saw_text = True
        if not state.sent_role:
            state.sent_role = True
            return [
                _make_chat_delta_chunk(state=state, delta={"role": "assistant"}),
                _make_chat_delta_chunk(state=state, delta={"content": text}),
            ]
        return [_make_chat_delta_chunk(state=state, delta={"content": text})]

    if event_type == "response.reasoning_summary_text.delta":
        delta = event_payload.get("delta")
        if not isinstance(delta, str) or not delta:
            return []
        state.saw_reasoning = True
        if not state.sent_role:
            state.sent_role = True
            return [
                _make_chat_delta_chunk(state=state, delta={"role": "assistant"}),
                _make_chat_delta_chunk(state=state, delta={"reasoning_content": delta}),
            ]
        return [_make_chat_delta_chunk(state=state, delta={"reasoning_content": delta})]

    if event_type == "response.refusal.delta":
        delta = event_payload.get("delta")
        if not isinstance(delta, str) or not delta:
            return []
        state.saw_refusal = True
        if not state.sent_role:
            state.sent_role = True
            return [
                _make_chat_delta_chunk(state=state, delta={"role": "assistant"}),
                _make_chat_delta_chunk(state=state, delta={"refusal": delta}),
            ]
        return [_make_chat_delta_chunk(state=state, delta={"refusal": delta})]

    if event_type == "response.refusal.done":
        text = event_payload.get("text")
        if not isinstance(text, str) or not text or state.saw_refusal:
            return []
        state.saw_refusal = True
        if not state.sent_role:
            state.sent_role = True
            return [
                _make_chat_delta_chunk(state=state, delta={"role": "assistant"}),
                _make_chat_delta_chunk(state=state, delta={"refusal": text}),
            ]
        return [_make_chat_delta_chunk(state=state, delta={"refusal": text})]

    if event_type == "response.output_item.added":
        item = event_payload.get("item") or {}
        item_type = item.get("type")
        if item_type == "function_call":
            return _handle_function_call_item(
                item=item,
                output_index=int(event_payload.get("output_index") or 0),
                state=state,
            )
        if item_type == "message":
            return _handle_message_output_item(item=item, state=state)
        if item_type == "reasoning":
            return _handle_reasoning_output_item(item=item, state=state)
        return []

    if event_type == "response.function_call_arguments.delta":
        delta = event_payload.get("delta")
        if not isinstance(delta, str) or not delta:
            return []
        output_index = int(event_payload.get("output_index") or 0)
        tool_index = state.output_index_to_tool_index.get(output_index)
        if tool_index is None:
            return []
        state.output_indices_with_tool_args.add(output_index)
        return [
            _make_chat_delta_chunk(
                state=state,
                delta={
                    "tool_calls": [
                        {
                            "index": tool_index,
                            "function": {
                                "arguments": delta,
                            },
                        }
                    ]
                },
            )
        ]

    if event_type == "response.function_call_arguments.done":
        output_index = int(event_payload.get("output_index") or 0)
        arguments = event_payload.get("arguments")
        if not isinstance(arguments, str) or not arguments:
            return []
        if output_index in state.output_indices_with_tool_args:
            return []
        tool_index = state.output_index_to_tool_index.get(output_index)
        if tool_index is None:
            return []
        state.output_indices_with_tool_args.add(output_index)
        return [
            _make_chat_delta_chunk(
                state=state,
                delta={
                    "tool_calls": [
                        {
                            "index": tool_index,
                            "function": {
                                "arguments": arguments,
                            },
                        }
                    ]
                },
            )
        ]

    if event_type == "response.reasoning_summary_text.done":
        text = event_payload.get("text")
        if not isinstance(text, str) or not text or state.saw_reasoning:
            return []
        state.saw_reasoning = True
        if not state.sent_role:
            state.sent_role = True
            return [
                _make_chat_delta_chunk(state=state, delta={"role": "assistant"}),
                _make_chat_delta_chunk(state=state, delta={"reasoning_content": text}),
            ]
        return [_make_chat_delta_chunk(state=state, delta={"reasoning_content": text})]

    if event_type == "response.output_item.done":
        item = event_payload.get("item") or {}
        if item.get("type") == "function_call":
            return _handle_function_call_item(
                item=item,
                output_index=int(event_payload.get("output_index") or 0),
                state=state,
                include_arguments_when_missing=True,
            )
        if item.get("type") == "message" and not (state.saw_text or state.saw_refusal):
            return _handle_message_output_item(item=item, state=state)
        if item.get("type") == "reasoning" and not state.saw_reasoning:
            return _handle_reasoning_output_item(item=item, state=state)
        return []

    if event_type in {
        "response.completed",
        "response.done",
        "response.incomplete",
        "response.failed",
        "response.cancelled",
        "response.canceled",
    }:
        response = event_payload.get("response") or {}
        if response.get("model"):
            state.model = response["model"]
        error = event_payload.get("error")
        if isinstance(error, dict) and not isinstance(response.get("error"), dict):
            response = {**response, "error": error}
        usage = response.get("usage")
        if isinstance(usage, dict):
            state.usage = {
                "prompt_tokens": int(usage.get("input_tokens") or 0),
                "completion_tokens": int(usage.get("output_tokens") or 0),
                "total_tokens": int(usage.get("input_tokens") or 0) + int(usage.get("output_tokens") or 0),
            }
            details = usage.get("input_tokens_details")
            if isinstance(details, dict) and details.get("cached_tokens"):
                state.usage["prompt_tokens_details"] = {"cached_tokens": details["cached_tokens"]}
        chunks = _handle_terminal_event_message(
            event_type=event_type,
            event_payload=event_payload,
            state=state,
        )
        return chunks + finalize_chat_stream(state=state, response=response, event_type=event_type)

    return []


def finalize_chat_stream(
    *,
    state: ChatCompletionsStreamState,
    response: dict[str, Any] | None = None,
    event_type: str | None = None,
) -> list[dict[str, Any]]:
    if state.finalized:
        return []
    state.finalized = True

    finish_reason = "tool_calls" if state.saw_tool_call else "stop"
    response = response or {}
    incomplete_details = response.get("incomplete_details") or {}
    if response.get("status") == "incomplete" and incomplete_details.get("reason") == "max_output_tokens":
        finish_reason = "length"
    elif response.get("status") == "incomplete" and incomplete_details.get("reason") == "content_filter":
        finish_reason = "content_filter"
    elif event_type == "response.failed":
        error = response.get("error")
        if not isinstance(error, dict):
            error = {}
        if error.get("type") == "safety_error":
            finish_reason = "content_filter"

    chunks: list[dict[str, Any]] = [
        {
            "id": state.id,
            "object": "chat.completion.chunk",
            "created": state.created,
            "model": state.model or response.get("model") or "openai/responses",
            "choices": [
                {
                    "index": 0,
                    "delta": {},
                    "finish_reason": finish_reason,
                }
            ],
        }
    ]
    if state.include_usage and state.usage:
        chunks.append(
            {
                "id": state.id,
                "object": "chat.completion.chunk",
                "created": state.created,
                "model": state.model or response.get("model") or "openai/responses",
                "choices": [],
                "usage": state.usage,
            }
        )
    return chunks


def format_chat_chunk_sse(chunk: dict[str, Any]) -> bytes:
    return f"data: {json.dumps(chunk, separators=(',', ':'))}\n\n".encode("utf-8")


def done_sse_chunk() -> bytes:
    return b"data: [DONE]\n\n"


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


def _make_chat_delta_chunk(*, state: ChatCompletionsStreamState, delta: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": state.id,
        "object": "chat.completion.chunk",
        "created": state.created,
        "model": state.model or "openai/responses",
        "choices": [
            {
                "index": 0,
                "delta": delta,
                "finish_reason": None,
            }
        ],
    }


def _handle_function_call_item(
    *,
    item: dict[str, Any],
    output_index: int,
    state: ChatCompletionsStreamState,
    include_arguments_when_missing: bool = False,
) -> list[dict[str, Any]]:
    tool_index = state.output_index_to_tool_index.get(output_index)
    chunks: list[dict[str, Any]] = []

    if tool_index is None:
        state.saw_tool_call = True
        tool_index = state.next_tool_call_index
        state.output_index_to_tool_index[output_index] = tool_index
        state.next_tool_call_index += 1
        chunks.append(
            _make_chat_delta_chunk(
                state=state,
                delta={
                    "tool_calls": [
                        {
                            "index": tool_index,
                            "id": item.get("call_id"),
                            "type": "function",
                            "function": {
                                "name": item.get("name", ""),
                            },
                        }
                    ]
                },
            )
        )

    arguments = item.get("arguments")
    if include_arguments_when_missing and isinstance(arguments, str) and arguments and output_index not in state.output_indices_with_tool_args:
        state.output_indices_with_tool_args.add(output_index)
        chunks.append(
            _make_chat_delta_chunk(
                state=state,
                delta={
                    "tool_calls": [
                        {
                            "index": tool_index,
                            "function": {
                                "arguments": arguments,
                            },
                        }
                    ]
                },
            )
        )

    return chunks


def _handle_message_output_item(*, item: dict[str, Any], state: ChatCompletionsStreamState) -> list[dict[str, Any]]:
    content_parts = item.get("content")
    if not isinstance(content_parts, list):
        return []

    text = "".join(
        part.get("text", "")
        for part in content_parts
        if isinstance(part, dict) and part.get("type") == "output_text" and isinstance(part.get("text"), str)
    )
    refusal = "".join(
        part.get("text", "")
        for part in content_parts
        if isinstance(part, dict) and part.get("type") == "refusal" and isinstance(part.get("text"), str)
    )

    chunks: list[dict[str, Any]] = []
    if not state.sent_role and (text or refusal):
        state.sent_role = True
        chunks.append(_make_chat_delta_chunk(state=state, delta={"role": "assistant"}))

    if text:
        state.saw_text = True
        chunks.append(_make_chat_delta_chunk(state=state, delta={"content": text}))
    if refusal:
        state.saw_refusal = True
        chunks.append(_make_chat_delta_chunk(state=state, delta={"refusal": refusal}))
    return chunks


def _handle_reasoning_output_item(*, item: dict[str, Any], state: ChatCompletionsStreamState) -> list[dict[str, Any]]:
    summary_parts = item.get("summary")
    if not isinstance(summary_parts, list):
        return []

    reasoning_text = "".join(
        part.get("text", "")
        for part in summary_parts
        if isinstance(part, dict) and part.get("type") == "summary_text" and isinstance(part.get("text"), str)
    )
    if not reasoning_text:
        return []

    state.saw_reasoning = True
    if not state.sent_role:
        state.sent_role = True
        return [
            _make_chat_delta_chunk(state=state, delta={"role": "assistant"}),
            _make_chat_delta_chunk(state=state, delta={"reasoning_content": reasoning_text}),
        ]
    return [_make_chat_delta_chunk(state=state, delta={"reasoning_content": reasoning_text})]


def _handle_terminal_event_message(
    *,
    event_type: str,
    event_payload: dict[str, Any],
    state: ChatCompletionsStreamState,
) -> list[dict[str, Any]]:
    if event_type == "response.failed":
        error = event_payload.get("error")
        if not isinstance(error, dict):
            error = {}
        if state.saw_text or state.saw_refusal or state.saw_tool_call:
            return []
        message = error.get("message")
        if not isinstance(message, str) or not message:
            return []
        state.saw_refusal = True
        if not state.sent_role:
            state.sent_role = True
            return [
                _make_chat_delta_chunk(state=state, delta={"role": "assistant"}),
                _make_chat_delta_chunk(state=state, delta={"refusal": message}),
            ]
        return [_make_chat_delta_chunk(state=state, delta={"refusal": message})]

    if event_type not in {"response.cancelled", "response.canceled"}:
        return []
    if state.saw_text or state.saw_refusal or state.saw_tool_call:
        return []
    state.saw_refusal = True
    cancellation_message = "The response was canceled before completion."
    if not state.sent_role:
        state.sent_role = True
        return [
            _make_chat_delta_chunk(state=state, delta={"role": "assistant"}),
            _make_chat_delta_chunk(state=state, delta={"refusal": cancellation_message}),
        ]
    return [_make_chat_delta_chunk(state=state, delta={"refusal": cancellation_message})]
