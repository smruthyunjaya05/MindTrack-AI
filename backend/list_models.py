import google.generativeai as genai

genai.configure(api_key='AIzaSyAUkjiptEwt0M2gQ3_mIVVNsmBulRsIxfE')

print("Available Gemini models:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"  - {m.name}")
