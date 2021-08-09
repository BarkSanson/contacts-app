const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const Contact = require("../models/contact");

router.get("/", async (req, res) => {
  const contacts = await Contact.find().lean();
  res.render("contacts/all-contacts", { contacts });
});

router.get("/add", (req, res) => {
  res.render("contacts/add-contact");
});

router.post(
  "/add",
  body("name").notEmpty().withMessage("Name field can't be empty!"),
  body("phone").notEmpty().withMessage("Phone field can't be empty!"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("contacts/add-contact", errors);
    }

    const { name, surname, email, phone } = req.body;
    const contact = new Contact({ name, surname, email, phone });

    await contact.save();
    res.redirect("/contacts");
  }
);

router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id).lean();

  res.render("contacts/edit-contact", { contact });
});

router.put(
  "/edit/:id",
  body("name").notEmpty().withMessage("Name field can't be empty!"),
  body("phone").notEmpty().withMessage("Phone field can't be empty!"),
  async (req, res) => {
    const contact = await Contact.findById(req.params.id).lean();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("contacts/edit-contact", { errors, contact });
    }

    const { name, surname, email, phone } = req.body;
    await Contact.findByIdAndUpdate(req.params.id, { name, surname, email, phone }, { useFindAndModify: false});
    res.redirect('/contacts');
  } 
);

module.exports = router;
