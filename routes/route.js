const {body} = require('express-validator');
const {
  registerUserController,
  loginUserController,
  sendOtpController,
  verifyOtpController,
  changePasswordController,
  routeProtectionController,
} = require('../controllers/userController');

//user section start
const {loginValidationRules, validateLoginUser} = require('../validationRules/loginValidation');
const {
    registrationValidationRules,
    validateRegisterUser,
} = require('../validationRules/registrationValidation');
const {
    passwordValidationRules,
    validatePassword,
} = require('../validationRules/validatePassword');
const { upload, resizeImages } = require('../utils/multer');

const { about, saveAbout } = require('../controllers/aboutController');
const {
  contactInfoValidationRules,
  contactInfoValidate,
} = require('../validationRules/contactValidation');
const { updateContactInfo, getContactInfo } = require('../controllers/contactController');
const { sendMessage, getMessages, replyMessage } = require('../controllers/contactFormController');
const {
  createPortfolio,
  getAllPortfolio,
  deletePortfolio,
  updatePortfolio,
} = require('../controllers/portfolioController');
const authenticateToken = require('../middlewares/authenticateToken');

const { createAbout, updateAbout} = require("../controllers/aboutController");
const {creativity, createCreative, updateCreative} = require("../controllers/creativityController");
const {
    projectsList,
    updateProjectsSerialNumber,
    removeProject,
    createProject,
    updateProject
} = require("../controllers/projectsController");
const {createService, updateService, removeService, services} = require("../controllers/servicesController");

const router = require('express').Router();

//User auth start
router.post(
  '/register-user',
  registrationValidationRules,
  validateRegisterUser,
  registerUserController,
);
router.post('/login-user', loginValidationRules, validateLoginUser, loginUserController);
router.put('/reset-password', passwordValidationRules, validatePassword, changePasswordController);
router.post('/send-otp', sendOtpController);
router.post('/verify-otp', verifyOtpController);
router.get('/protected', routeProtectionController);
//User auth end

//Location section start
router.put(
  '/update-contact-address',
  authenticateToken,
  contactInfoValidationRules,
  contactInfoValidate,
  updateContactInfo,
);
router.get('/getcontact-address', getContactInfo);
//Location section end

//Message section start
router.post('/send-message', sendMessage);
router.get('/get-messages', authenticateToken, getMessages);
router.post('/reply-message', authenticateToken, replyMessage);
//Message section end

//Portfolio section start
router.post(
  '/create-portfolio',
  authenticateToken,
  upload.array('images'),
  resizeImages,
  createPortfolio,
);
router.get('/get-all-portfolio', authenticateToken, getAllPortfolio);
router.delete('/delete-portfolio/:id', authenticateToken, deletePortfolio);
router.patch('/update-user/:id', authenticateToken, updatePortfolio);
//Portfolio section end

//about
router.get('/about', about);
router.post('/saveAbout/:id', updateAbout);
router.post('/create-about', createAbout);
//only an admin can update it via dashboard
router.put('/update-about/:id', updateAbout);

//creativity
router.get('/creativity', creativity);
router.post('/create-creativity', createCreative);
router.put('/update-creativity/:id', updateCreative);

//projects
router.post('/create-project', createProject);
router.put('/update-project/:id', updateProject);
router.get('/projects-list', projectsList);
router.put('/update-serial-number/:id', updateProjectsSerialNumber);
router.delete('/remove-project/:id', removeProject);

//services
router.post('/create-service', createService);
router.put('/update-service/:id', updateService);
router.delete('/remove-service/:id' , removeService);
router.get('/services' , services);

module.exports = router;
