import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const questions = req.body.questions || [];
  if (questions.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter at least one valid question",
      },
    });
    return;
  }

  try {
    const answers = [];
    for (const question of questions) {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(question),
        temperature: 0.6,
        max_tokens: 500,
      });
      answers.push(completion.data.choices[0].text.trim());
    }
    res.status(200).json({ result: answers });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(question) {
  return `As a professional Salesforce solution engineer, answer the following RFP question highlighting Salesforce in a positive light: \n${question}`;
}
