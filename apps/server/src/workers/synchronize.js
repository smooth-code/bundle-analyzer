import '../init'
import { consumeJobs } from 'modules/jobs'
import synchronizeJob from 'jobs/synchronize'

consumeJobs([synchronizeJob])
