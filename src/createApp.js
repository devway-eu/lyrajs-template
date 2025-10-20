import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { mkdir, cp } from "fs/promises"
import readline from "readline"
import { spawn } from "child_process"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function createApp() {
    const projectName = await prompt("Project name: ")

    const targetDir = path.resolve(process.cwd(), projectName)
    const templateDir = path.resolve(__dirname, "../template")

    if (fs.existsSync(targetDir)) {
        console.error(`❌ Directory ${projectName} already exists.`)
        process.exit(1)
    }

    console.log(`\nCreating project "${projectName}"...`)

    await mkdir(targetDir)
    await cp(templateDir, targetDir, { recursive: true })

    const envExample = path.join(targetDir, '.env.example')
    if (fs.existsSync(envExample)) {
        await cp(envExample, path.join(targetDir, '.env'))
    }

    console.log(`\n✔ Project "${projectName}" created.`)

    const shouldInstall = await confirm("\nInstall dependencies now? (Y/n) ")

    if(shouldInstall)
    {
        console.log(`\n➟ Installing dependencies...`)

        const installSuccess = await installDependencies(targetDir)

        if(installSuccess)
        {
            console.log(`\n✔ Dependencies installed successfully!\n`)
            console.log(`You're all set! Run these commands to start:\n`)
            console.log(`➡ cd ${projectName}`)
            console.log(`➡ npm run dev`)
        }
        else
        {
            console.log(`➡ cd ${projectName}`)
            console.log(`➡ npm install`)
            console.log(`➡ npm run dev`)
        }
    }
    else
    {
        console.log(`➡ cd ${projectName}`)
        console.log(`➡ npm install`)
        console.log(`➡ npm run dev`)
    }
}

// Simple readline prompt
function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise((resolve) => rl.question(question, (ans) => {
        rl.close()
        resolve(ans.trim())
    }))
}

function installDependencies(targetDir) {
    return new Promise((resolve) => {
        const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm"
        const install = spawn(npmCommand, ["install"], {
            cwd: targetDir,
            stdio: "inherit",
            shell: true
        })

        install.on("close", (code) => {
            resolve(code === 0)
        })

        install.on("error", () => {
            resolve(false)
        })
    })
}

function confirm(question) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    return new Promise((resolve) => {
    rl.question(question, (ans) => {
            rl.close()
            const answer = ans.trim().toLowerCase()
            // Default to yes if empty or starts with 'y'
            resolve(answer === "" || answer === "y" || answer === "yes")
        })
    })
}