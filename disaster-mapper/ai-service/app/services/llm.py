import os
import json
from openai import OpenAI
from app.config import settings

class LLMService:
    def __init__(self):
        self.api_key = getattr(settings, 'LLM_API_KEY', os.getenv('OPENAI_API_KEY'))
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None
        
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "get_disaster_details",
                    "description": "Get details about a specific disaster event",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "disaster_id": {"type": "string"}
                        },
                        "required": ["disaster_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_safe_routes",
                    "description": "Get safe evacuation routes for a disaster",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "disaster_id": {"type": "string"},
                            "origin": {"type": "string"}
                        },
                        "required": ["disaster_id"]
                    }
                }
            }
        ]

    def execute_prompt(self, prompt: str, disaster_id: str):
        if not self.client:
            return {
                "status": "REQUIRES_EXTERNAL_CONFIGURATION",
                "message": "LLM_API_KEY is not configured. Real LLM inference is disabled."
            }
            
        messages = [
            {"role": "system", "content": "You are DisasterMapper Copilot. Use tools to answer questions."},
            {"role": "user", "content": prompt}
        ]
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo",
                messages=messages,
                tools=self.tools,
                tool_choice="auto"
            )
            
            message = response.choices[0].message
            
            # Simple mock tool execution
            if message.tool_calls:
                messages.append(message)
                for tool_call in message.tool_calls:
                    if tool_call.function.name == "get_disaster_details":
                        tool_result = json.dumps({"disaster": "Kyoto Earthquake", "severity": "HIGH"})
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "name": tool_call.function.name,
                            "content": tool_result
                        })
                
                final_response = self.client.chat.completions.create(
                    model="gpt-4-turbo",
                    messages=messages
                )
                return {
                    "status": "LIVE",
                    "message": final_response.choices[0].message.content,
                    "tools_called": [tc.function.name for tc in message.tool_calls]
                }
                
            return {
                "status": "LIVE",
                "message": message.content,
                "tools_called": []
            }
            
        except Exception as e:
            return {
                "status": "ERROR",
                "message": str(e)
            }

llm_service = LLMService()
