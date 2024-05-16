// logic/admin/admin.approval.js
const AUTH = require("../../models/AuthModel");
const { sendEmail } = require("./services/admin.email.sending.approval");

exports.pendingAgencyRegistrations = async (req, res) => {
  try {
    const pendingRegistrations = await AUTH.find({
      type: "agency",
      approvalStatus: "pending",
    });
    res.status(200).json({ pendingRegistrations });
  } catch (error) {
    console.error("Error fetching pending agency registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.approveAgencyRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const agency = await AUTH.findOne({ _id: id, type: "agency" });
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }
    // Update approval status to 'approved'
    await AUTH.findByIdAndUpdate(id, { approvalStatus: "approved" });

    // Send approval email to the agency
    const subject = `Your Agency Registration on TataGuid is approved`;
    const text = `This email confirms that your agency registration on TataGuid has been approved.
    You can now log in to the platform using your registered email and password.
    Thank you for your interest in our platform.
    Sincerely,
    The TataGuid Team`;
    await sendEmail(agency.email, subject, text);

    res.status(200).json({ message: "Agency registration approved" });
  } catch (error) {
    console.error("Error approving agency registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.rejectAgencyRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const agency = await AUTH.findOne({ _id: id, type: "agency" });
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    // Update approval status to 'rejected'
    await AUTH.findByIdAndUpdate(id, { approvalStatus: "rejected" });

    // Send rejection email to the agency
    const subject = `Your Agency Registration on TataGuid is rejected`;
    const text = `This email confirms that your agency registration on TataGuid has been rejected.
     We regret to inform you that your registration did not meet our criteria.
     Please feel free to contact us if you have any questions.
     Sincerely,
     The TataGuid Team`;

    await sendEmail(agency.email, subject, text);

    // Delete the agency from the database
    await AUTH.findByIdAndDelete(id);

    // Implement email sending logic here
    res.status(200).json({ message: "Agency registration rejected" });
  } catch (error) {
    console.error("Error rejecting agency registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
