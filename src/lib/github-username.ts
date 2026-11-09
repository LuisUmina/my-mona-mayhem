const USERNAME = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export function isGitHubUsername(value: string): boolean {
    return USERNAME.test(value);
}
