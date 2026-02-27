export const getEmailTemplate = (text: string, isAuto: boolean = false) => ({
  subject: `Chatbot Consultation Summary`,
  text,
  html: `
    <h3>Chatbot Consultation Summary</h3>
    <pre style="white-space: pre-wrap; font-family: sans-serif;">${text}</pre>
    <hr />
    <p>This summary was ${isAuto ? 'automatically generated and sent' : 'generated'} by the AI Chatbot${isAuto ? '.' : ' and submitted by the user.'}</p>
  `,
});
