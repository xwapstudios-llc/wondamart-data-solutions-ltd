const command = {
    "clone": (repo: string, path: string) => `git clone ${repo} ${path}`,
    "pull": (path: string) => `cd ${path} && git pull`,
    "checkout": (path: string, branch: string) => `cd ${path} && git checkout ${branch}`,
    "status": (path: string) => `cd ${path} && git status`
}