const chatSchema = require("../model/chatSchema");

exports.createChat = async (req, res, next) => {
  const { employeeID, missionID } = req.body;
  try {
    const chat = await chatSchema
      .findOne({
        employeeID,
        missionID,
      })
      .populate(["employeeID", "missionID"]);
    if (chat)
      return res.status(200).json({ message: "Chat already exist", chat });
    const newChat = new chatSchema({ employeeID, missionID });
    await newChat.save();
    const populatedNewChat = await chatSchema
      .findById(newChat._id)
      .populate(["employeeID", "missionID"]);
    res
      .status(201)
      .json({ message: "Chat created successfully", populatedNewChat });
  } catch (error) {
    next(error);
  }
};
