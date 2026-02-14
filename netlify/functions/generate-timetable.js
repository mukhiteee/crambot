// ============================================
// DEBUG VERSION - NETLIFY FUNCTION
// This will help us see what's wrong
// ============================================

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // DETAILED LOGGING
  console.log('=== FUNCTION CALLED ===');
  console.log('Method:', event.httpMethod);
  console.log('Environment variables available:', Object.keys(process.env).length);
  console.log('GROQ_API_KEY exists?', !!process.env.GROQ_API_KEY);
  console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length);
  console.log('GROQ_API_KEY first 10 chars:', process.env.GROQ_API_KEY?.substring(0, 10));

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get the prompt from the request body
    const { prompt, model = 'llama-3.3-70b-versatile' } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    console.log('Prompt received, length:', prompt.length);
    console.log('Model:', model);

    // Check if API key exists BEFORE calling Groq
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY is not set!');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'API key not configured',
          debug: 'GROQ_API_KEY environment variable is missing'
        })
      };
    }

    console.log('Calling Groq API...');

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are Dr. Sarah Chen. Generate JSON only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    console.log('Groq API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: errorData.error?.message || 'API request failed',
          details: errorData,
          debug: {
            status: response.status,
            keyProvided: !!process.env.GROQ_API_KEY,
            keyLength: process.env.GROQ_API_KEY?.length
          }
        })
      };
    }

    const data = await response.json();
    console.log('✅ Success! Response received');

    // Return the response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('❌ Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      })
    };
  }
};  