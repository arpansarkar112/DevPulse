import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post('/', auth('contributor', 'maintainer'), issuesController.createIssue);
router.get('/', auth('contributor', 'maintainer'), issuesController.getAllIssues);
router.get('/:id', auth('contributor', 'maintainer'), issuesController.getSingleIssue);
router.patch('/:id', auth('contributor', 'maintainer'), issuesController.updateIssue);
router.delete('/:id', auth('maintainer'), issuesController.deleteIssue);

export const issuesRoute = router;