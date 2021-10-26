import * as github from '@actions/github'
import * as tar from 'tar'
import * as fs from 'fs'
import * as core from '@actions/core'
import {Octokit} from '@octokit/core'
import {Api} from '@octokit/plugin-rest-endpoint-methods/dist-types/types'

export async function tarFeaturesDirectory(path: string) {
  return tar.create({file: 'features.tgz', C: path}, ['.']).then(_ => {
    core.info('Compressed features directory to file features.tgz')
  })
}
