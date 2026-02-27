const params = { "openai-api": "32", "gemini": "30", "deepseek": "0", "groq": "65" };
const newValues = {};
Object.entries(params).forEach(([key, value]) => {
  if (value === "true") newValues[key] = true;
  else if (value === "false") newValues[key] = false;
  else if (!isNaN(Number(value))) newValues[key] = Number(value);
  else newValues[key] = value;
});
console.log(newValues);
