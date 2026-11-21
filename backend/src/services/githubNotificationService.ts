export async function publishFailureNotification(url: string, accessToken: string, failMessage: string){
    let commentUrl = url.replace('/pulls/', '/issues/');
    commentUrl += '/comments';
    const response = await fetch(commentUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            "body": failMessage
        })
    })
    if(!response.ok){
        throw new Error(`The request ended with error code ${response.status}`);
    }
    const data = await response.json();
    return data;
}