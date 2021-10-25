import * as core from '@actions/core'
import * as github from '@actions/github'
import { tarFeaturesDirectory } from './utils'

async function run(): Promise<void> {
  try {
    core.debug("Reading in secrets...")
    const token = core.getInput('token')
    const octokit = github.getOctokit(token)

    // Defaults to root directory, "."
    const featuresPath = core.getInput('path-to-features')

    core.debug(`Starting...`);
    core.debug("calling tarFeaturesDirectory()")
    await tarFeaturesDirectory(featuresPath);
    
    core.debug("Run has finished.")

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

// Kick off execution
run()
