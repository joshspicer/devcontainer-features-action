import * as github from '@actions/github'
import * as core from '@actions/core'
import {Octokit} from '@octokit/core'
import {Api} from '@octokit/plugin-rest-endpoint-methods/dist-types/types'
import * as tar from 'tar'
import * as fs from 'fs'

// Creates a release at the current context's ref with the given tagName
export async function createRelease(octokit: Octokit & Api, tagName: string) {
  core.debug(`Starting to create release against ${github.context.ref}`);
  const release = await octokit.rest.repos.createRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: tagName,
    // target_commitish: github.context.ref,
    name: 'Features Release'
  });

  if (release.status > 299) {
    core.setFailed(`Could not create release. Status code: ${release.status}`)
    return undefined
  }

  core.info(
    `Created release (${release.status}) with tag '${tagName}' at ${release.data.upload_url}`
  )
  return release
}

// Updates a provided release with the relevant features assets
export async function updateReleaseAssetsWithFeaturesDir(
  octokit: Octokit & Api,
  release: {upload_url: string; id: number},
  featuresPath: string
) {
  tar.create({file: 'features.tgz'}, [featuresPath]).then(_ => {
    fs.readFile(
      './features.tgz',
      {
        encoding: 'utf-8'
      },
      (err, data) => {
        if (err) {
          core.setFailed(err.message)
        }

        let uploaded = octokit.rest.repos
          .uploadReleaseAsset({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            release_id: release.id,
            name: 'features.tgz',
            data
          })
          .then(res => {
            if (!res || res.status > 299) {
              core.setFailed(
                `Could not upload asset. Status Code: ${res.status}`
              )
            }
            core.setOutput('uploaded-state', res.data.state)
            core.setOutput(
              'uploaded-browser-upload-url',
              res.data.browser_download_url
            )
          })
      }
    )
  })
}
