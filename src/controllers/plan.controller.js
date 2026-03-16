import Plan from "../models/Plan.js";

export const createPlan = async (req, res) => {

  try {

    const { planName, routes } = req.body;

    const plan = new Plan({
      planName,
      routes
    });

    await plan.save();

    res.json(plan);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

export const getPlans = async (req, res) => {

  try {

    const plans = await Plan.find()
      .populate("routes.routeId");

    res.json(plans);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};