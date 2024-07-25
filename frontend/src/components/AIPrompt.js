import React, { useState, useEffect } from 'react';
import '../styles/Form.css';

function AIPrompt() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [chatResponses, setChatResponses] = useState([]);

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
    };

    const handleQuestion = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/openai_response', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });

            const data = await response.json();
            const formattedAnswer = data.answer.replace(/\n/g, '<br>');

            setAnswer(formattedAnswer);
        } catch (error) {
            console.error('Error while fetching response from the server:', error);
        }
    };

    const fetchChatResponses = async () => {
        try {
            const response = await fetch('http://localhost:5000/get_chat_responses', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (response.ok) {
                setChatResponses(data.chat_responses);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error while fetching chat responses:', error);
        }
    };

    const handleSaveResponse = async () => {
        try {
            await fetch('http://localhost:5000/save_chat_response', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: answer }) // Updated to use answer
            });

            // Fetch chat responses after successfully saving response
            fetchChatResponses();
        } catch (error) {
            console.error('Error while saving response:', error);
        }
    };

    const handleDeleteResponse = async (responseId) => {
        try {
            await fetch(`http://localhost:5000/delete_chat_response/${responseId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // After deleting, fetch updated chat responses
            fetchChatResponses();
        } catch (error) {
            console.error('Error while deleting response:', error);
        }
    };

    useEffect(() => {
        fetchChatResponses();
    }, []);

    return (
        <div>
            <div id="ai-prompt-container">
                <h2>AI Prompt</h2>
                <form id="ai-prompt-form" onSubmit={handleQuestion}>
                    <textarea
                        className="ai-prompt-input"
                        value={question}
                        onChange={handleQuestionChange}
                        placeholder="Type your query about training sessions, nutrition, or weight management here..."
                        rows={4}
                        cols={50}
                    />
                    <br />
                    <button type="submit" className="ai-prompt-submit">Submit</button>
                    <button type="button" onClick={handleSaveResponse} className="ai-prompt-submit">Save Response</button>
                </form>
                <div>
                    <h3>Answer:</h3>
                    <p dangerouslySetInnerHTML={{ __html: answer }} />
                </div>
            </div>
            <div className="saved-responses-container">
                <h2>Chat Responses History</h2>
                {chatResponses.map((response, index) => (
                    <div key={index} className="saved-response">
                        <p dangerouslySetInnerHTML={{ __html: response.response }} />
                        <p>Date: {response.date}</p>
                        <button onClick={() => handleDeleteResponse(response.id)} className="delete-button">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AIPrompt;
