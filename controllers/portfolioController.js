const { default: mongoose } = require('mongoose');
const portfolioModel = require('../models/portfolioModel');

const createPortfolio = async (req, res) => {
  // Extract the fields from req.body
  const { title_EESS, title_IINN, sub_Title_EESS, sub_Title_IINN, sub_desc_EESS, sub_desc_IINN } =
    req.body;

  // Extract the uploaded and resized files
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ status: 'failed', message: 'Image files are required' });
  }

  // Construct image URLs for display and thumbnail versions
  const imageUrls = files.map(
    (file) => `${req.protocol}://${req.get('host')}/images/display-${file.filename}`,
  );
  const thumUrls = files.map(
    (file) => `${req.protocol}://${req.get('host')}/images/thumb-${file.filename}`,
  );

  try {
    // Check if any required field is missing
    if (
      !title_EESS ||
      !title_IINN ||
      !sub_Title_EESS ||
      !sub_Title_IINN ||
      !sub_desc_EESS ||
      !sub_desc_IINN
    ) {
      return res.status(400).json({ status: 'failed', message: 'All fields are required' });
    }

    // Save to the database
    await portfolioModel.create({
      title_EESS,
      title_IINN,
      images: imageUrls, // Store URLs for the display images
      thumbs: thumUrls, // Store URLs for the thumbnail images
      details: { sub_Title_EESS, sub_Title_IINN, sub_desc_EESS, sub_desc_IINN },
    });

    res.status(200).json({ status: 'ok', message: 'Successfully created' });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

const getAllPortfolio = async (req, res) => {
  try {
    const data = await portfolioModel.find({});
    res.status(200).json({ status: 'ok', data: data });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
};

const deletePortfolio = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await portfolioModel.deleteOne({ _id: id });
    if (data.acknowledged === true) {
      res.status(200).json({status:"ok", message:"Successfully deleted"});
    }
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
};

const updatePortfolio = async (req, res) => {
  const id = req.params.id;
  const { title_EESS, title_IINN, sub_Title_EESS, sub_Title_IINN, sub_desc_EESS, sub_desc_IINN } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 'failed', message: 'Invalid ID format' });
  }

  try {
    const exist = await portfolioModel.findOne({ _id: id });

    if (exist) {
      const data = await portfolioModel.updateOne(
        { _id: id },
        {
          $set: {
            title_EESS,
            title_IINN,
            details: {
              sub_Title_EESS,
              sub_Title_IINN,
              sub_desc_EESS,
              sub_desc_IINN,
            },
          },
        },
      );

      if (data.modifiedCount > 0) {
        res.status(200).json({ status: 'ok', message: 'Data updated successfully' });
      } else {
        res.status(200).json({ status: 'ok', message: 'No changes made' });
      }
    } else {
      res.status(404).json({ status: 'failed', message: 'Portfolio not found' });
    }
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ status: 'failed', message: 'Failed to update portfolio' });
  }
};

module.exports = { createPortfolio, getAllPortfolio, deletePortfolio, updatePortfolio };
