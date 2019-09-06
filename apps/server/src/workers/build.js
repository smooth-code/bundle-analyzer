import '../init'
import { consumeJobs } from '../modules/jobs'
import buildJob from '../jobs/build'

consumeJobs([buildJob])
