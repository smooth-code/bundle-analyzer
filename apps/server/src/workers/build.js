import 'init'
import { consumeJobs } from 'modules/jobs'
import buildJob from 'jobs/build'
import buildCheckJob from 'jobs/buildCheck'

consumeJobs([buildJob, buildCheckJob])
