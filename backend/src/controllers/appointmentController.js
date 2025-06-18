import Appointment from '../models/appointment.js';


export const bookAppointment = async (req, res) => {
  try {
    console.log("BOOKING REQUEST BODY:", req.body);

    const {
      patientId,
      patientFirstName,
      patientLastName,
      doctorId,
      doctorFirstName,
      doctorLastName,
      experience,
      appointmentCharges,
      city,
      pincode,
      appointmentDate,
      department,
      timeSlot // ✅ new field
    } = req.body;

    // Check for existing appointment with same doctor, date, and slot
    const existing = await Appointment.findOne({
      where: {
        doctorId,
        appointmentDate,
        timeSlot
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This slot is already booked. Please choose another slot.'
      });
    }

    const appointment = await Appointment.create({
      patientId,
      patientFirstName,
      patientLastName,
      doctorId,
      doctorFirstName,
      doctorLastName,
      experience,
      appointmentCharges,
      city,
      pincode,
      appointmentDate,
      department,
      timeSlot // ✅ save in DB
    });

    res.status(201).json({ success: true, appointment });
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 GET /api/appointments/
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET /api/appointments/booked-slots/:doctorId/:date
export const getBookedSlots = async (req, res) => {
  const { doctorId, date } = req.params;

  try {
    const appointments = await Appointment.findAll({
      where: {
        doctorId,
        appointmentDate: date
      },
      attributes: ['timeSlot']
    });

    const slots = appointments.map((a) => a.timeSlot);
    res.json({ success: true, slots });
  } catch (err) {
    console.error('Error fetching booked slots:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET appointments for a specific doctor
export const getAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const appointments = await Appointment.findAll({
      where: { doctorId },
      order: [['appointmentDate', 'ASC']],
    });

    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/appointments/:id/status
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ success: true, message: `Appointment ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const getAppointmentsByPatient = async (req, res) => {
  const { patientId } = req.params;
  console.log("🔍 Backend received patientId:", patientId); // 👈 ADD THIS

  try {
    const appointments = await Appointment.findAll({
      where: { patientId },
      order: [['appointmentDate', 'ASC']],
    });

    console.log("🗂️ Appointments found:", appointments); // 👈 ADD THIS

    res.status(200).json({ success: true, appointments });
  } catch (err) {
    console.error('Error fetching patient appointments:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await appointment.destroy();
    res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error('❌ Error deleting appointment:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
