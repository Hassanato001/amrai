import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const suggestionSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A concise title for the suggestion." },
        description: { type: Type.STRING, description: "A detailed explanation of the issue and the recommended improvement." },
        codeSnippet: { type: Type.STRING, description: "An optional code snippet demonstrating the suggested change. Use markdown for code.", nullable: true }
    },
    required: ["title", "description"]
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        html: { type: Type.ARRAY, items: suggestionSchema, description: "Suggestions related to HTML structure, semantics, and best practices." },
        css: { type: Type.ARRAY, items: suggestionSchema, description: "Suggestions for improving CSS, styling, layout, and responsiveness. Include Bootstrap-specific advice if applicable." },
        javascript: { type: Type.ARRAY, items: suggestionSchema, description: "Suggestions for JavaScript code, logic, performance, and modern practices. Emphasize robust error handling: suggest try-catch blocks, user-friendly error messages, and strategies for logging errors to a service for developers." },
        ui_ux: { type: Type.ARRAY, items: suggestionSchema, description: "Suggestions for improving the overall user interface and user experience." },
        performance: { type: Type.ARRAY, items: suggestionSchema, description: "Suggestions for optimizing website performance and loading speed." },
        accessibility: { type: Type.ARRAY, items: suggestionSchema, description: "Suggestions for making the website more accessible (a11y) to users with disabilities." }
    },
     required: ["html", "css", "javascript", "ui_ux", "performance", "accessibility"]
};


export const getWebsiteSuggestions = async (
    htmlCode: string,
    cssCode: string,
    jsCode: string,
    improvementGoal: string
): Promise<AnalysisResult> => {
    const prompt = `
        **User's Goal:** ${improvementGoal}

        Analyze the following website code. The user has provided their HTML, CSS (which might include Bootstrap), and JavaScript. 
        Provide specific, actionable suggestions to achieve the user's goal. For each suggestion, provide a title, a clear description of the problem and the proposed solution, and an optional corrected code snippet in markdown. 
        Categorize your suggestions into HTML, CSS, JavaScript, UI/UX, Performance, and Accessibility. If a section of code is empty, provide general best-practice suggestions for that category.

        **JavaScript Analysis Guidelines:**
        Pay special attention to error handling. Where applicable, suggest:
        1. Wrapping potentially failing operations (like API calls or complex calculations) in \`try...catch\` blocks.
        2. Implementing a user-friendly error display mechanism instead of showing raw error messages (e.g., updating a status message on the page instead of using \`alert()\`).
        3. Logging detailed error information for developers using \`console.error\`, and mention the concept of sending errors to a remote logging service in a production environment.

        --- HTML ---
        ${htmlCode || "<!-- No HTML provided -->"}

        --- CSS ---
        ${cssCode || "/* No CSS provided */"}

        --- JAVASCRIPT ---
        ${jsCode || "// No JavaScript provided"}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonString = response.text;
    try {
        const parsedJson = JSON.parse(jsonString);
        return parsedJson as AnalysisResult;
    } catch (e) {
        console.error("Failed to parse Gemini response:", jsonString);
        throw new Error("Received an invalid JSON response from the AI.");
    }
};