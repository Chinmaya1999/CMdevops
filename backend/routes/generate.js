const express = require('express');
const { auth } = require('../middleware/auth');
const GenerateController = require('../controllers/generateController');

const router = express.Router();

// Get available templates - public endpoint
router.get('/templates', GenerateController.getTemplates);

// All other generate routes require authentication
router.use(auth);

// Generate Jenkins pipeline
router.post('/jenkins', GenerateController.generateJenkins);

// Generate GitHub Actions workflow
router.post('/github-actions', GenerateController.generateGitHubActions);

// Generate Ansible playbook
router.post('/ansible', GenerateController.generateAnsible);

// Generate Kubernetes resources
router.post('/kubernetes', GenerateController.generateKubernetes);

// Generate Terraform configuration
router.post('/terraform', GenerateController.generateTerraform);

// Generate Dockerfile
router.post('/dockerfile', GenerateController.generateDockerfile);

// Generate Bash script
router.post('/bash', GenerateController.generateBash);

// Generate Shell script
router.post('/shell', GenerateController.generateShell);

// Generate Python script
router.post('/python', GenerateController.generatePython);

module.exports = router;
