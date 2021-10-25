import * as core from '@actions/core'
import * as github from '@actions/github';
import { createRelease, updateReleaseAssetsWithFeaturesDir } from './utils'

async function run(): Promise<void> {
  try {

    // Hydrate GitHub API provider
    const token = core.getInput('token')
    const octokit = github.getOctokit(token);
    
    // Defaults to root directory, "."
    const featuresPath = core.getInput('path-to-features');
    const tagName = core.getInput('tag-name');


    core.debug(`Starting`);
    const release = await createRelease(octokit, tagName);
    if (release) {
      await updateReleaseAssetsWithFeaturesDir(octokit, release.data, featuresPath);
    }

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}




// Kick off execution
run()
