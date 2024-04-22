export default {
    async fetch(request) {
        const body = `${request.headers.get("X-Real-IP")}`
        const newResponse = new Response(body, {
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        });
        return newResponse;
    },
};