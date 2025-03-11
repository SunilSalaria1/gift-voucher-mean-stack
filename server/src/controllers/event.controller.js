const { ObjectId, ReturnDocument } = require('mongodb');
const { connectDB, db } = require('../config/db.config');
const eventCollection = db.collection('events');
const eventSchema = require("../models/event.model");
const notificationSchema = require("../models/notification.model");
const notificationCollection = db.collection("notifications");

const createEvent = async (req, res) => {
    /*  #swagger.tags = ['Event']
                    #swagger.description = 'Create Event'
                    #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Event creation details',
                    required: true,
                    schema: { $ref: '#/definitions/createEvent' }
                    }
                    #swagger.responses[201] = {
                    description: 'Event Created successfully',
                    }
                    #swagger.responses[404] = {
                    description: 'Invalid '
                    }
                    */
    try {
        //  connect db first
        await connectDB();
        // Validate request body
        const validation = eventSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }
        // insert validation data if the value is
        const result = await eventCollection.insertOne(validation.data)
        if (!result.insertedId) {
            return res.status(500).json({ message: "Failed to insert event" });
        }
        console.log(result)
        const notificationObj = {
            message: `New event Added ${validation.data.title}`,
            eventId: result.insertedId.toString(),
        }
        const validateNotification = notificationSchema.safeParse(notificationObj)
        if (!validateNotification.success) {
            return res.status(400).json({ error: validateNotification.error.format() });
        }
        const result2 = await notificationCollection.insertOne(validateNotification.data)
        return res.status(201).json({ message: "Event created successfully", event: result, notification: result2 })

    } catch (error) {
        console.log(error)
    }
}

const updateEventById = async (req, res) => {
    /*  #swagger.tags = ['Event']
                   #swagger.description = 'Create Event'
                   #swagger.parameters['body'] = {
                   in: 'body',
                   description: 'Event update details',
                   required: true,
                   schema: { $ref: '#/definitions/updateEvent' }
                   }
                   #swagger.responses[200] = {
                   description: 'Event Updated successfully',
                   }
                   #swagger.responses[404] = {
                   description: 'Invalid '
                   }
                   */

    try {
        await connectDB();
        const eventId = req.params.id;

        if (!ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "Invalid event ID format" });
        }

        // Validate request body
        const validation = eventSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        // Fetch existing event

        const eventDetails = await eventCollection.findOne({ _id: ObjectId.createFromHexString(eventId), isDeleted: false });

        if (!eventDetails) {
            return res.status(404).json({ message: "Event not found" });
        }

        console.log("Request Body:", req.body);
        console.log("Validated Data:", validation.data);

        // Filter only fields present in req.body (ignores extra fields from validation.data)
        const updateFields = {};
        Object.keys(req.body).forEach((key) => {
            if (validation.data.hasOwnProperty(key)) {
                updateFields[key] = validation.data[key];
            }
        });
        console.log("updateFields", updateFields)

        // Update only filtered fields
        const updatedEvent = await eventCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(eventId) },
            {
                $set: {
                    ...updateFields,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        if (!updatedEvent) {
            return res.status(500).json({ message: "Failed to update event" });
        }

        return res.status(200).json({ message: "Event updated successfully", updatedEvent: updatedEvent });

    } catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteEventById = async (req, res) => {
    /*  #swagger.tags = ['Event']
        #swagger.description = 'Deletes an event by marking it as deleted'

        #swagger.responses[200] = {
            description: 'Event deleted successfully',
        }
        #swagger.responses[400] = {
            description: 'Invalid Event ID format or validation error'
        }
        #swagger.responses[404] = {
            description: 'Event not found'
        }
        #swagger.responses[500] = {
            description: 'Internal Server Error'
        }
    */
    try {
        await connectDB();
        const eventId = req.params.id;

        if (!ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "Invalid Event ID format" });
        }

        //  Check if event exists
        const eventDetails = await eventCollection.findOne({ _id: new ObjectId(eventId), isDeleted: false });
        if (!eventDetails) {
            return res.status(404).json({ message: "Event not found" });
        }

        //  Soft delete event
        const deletedEvent = await eventCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(eventId) },
            { $set: { isDeleted: true } },
            { returnDocument: 'after' }
        );

        if (!deletedEvent) {
            return res.status(404).json({ message: "Failed to delete event" });
        }

        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getEventById = async (req, res) => {
    /*  #swagger.tags = ['Event']
          #swagger.description = 'Update'
          */
    try {
        await connectDB();
        const eventId = req.params.id;
        // Validate Product Id
        if (!ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "Invalid Product Id" });
        }
        // Define the filter to find the product
        const filter = { _id: ObjectId.createFromHexString(eventId), isDeleted: false, isActive: true };

        // Aggregate to join product with images collection
        const event = await eventCollection.aggregate([
            { $match: filter }, // Apply filtering

            {
                $lookup: {
                    from: 'images', // Join with the 'images' collection
                    localField: 'imageId', // The field in event collection that holds the file _id
                    foreignField: '_id', // The field in images collection that corresponds to the productImage _id
                    as: 'eventImageDetails' // The alias for the joined data
                }
            },
            { $unwind: "$eventImageDetails" }, // Unwind the array to get a single image
            {
                $project: {

                    "eventImageDetails.isDeleted": 0 // Remove isDeleted from productImageDetails
                }
            }
        ]).toArray();

        // Check if the product is found
        if (event.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Convert buffer to Base64 and add imageUrl
        const eventObj = event[0]; // Since we expect only one product with the provided ID
        if (eventObj.eventImageDetails && eventObj.eventImageDetails.fileBuffer) {
            // Convert the fileBuffer to Base64
            const base64Image = eventObj.eventImageDetails.fileBuffer.toString('base64');
            // Add the Base64 string as a new field in the image details
            eventObj.eventImageDetails.imageUrl = `data:${eventObj.eventImageDetails.fileType};base64,${base64Image}`;
            delete eventObj.eventImageDetails.fileBuffer;

            delete eventObj.isDeleted;
            delete eventObj.isActive;
            delete eventObj.updatedAt;
            delete eventObj.eventImageDetails.fileType;
            delete eventObj.eventImageDetails.uploadedAt;
        }

        return res.json(eventObj);

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getAllEvents = async (req, res) => {
    try {
        await connectDB();

        // Pagination Setup
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const isPaginationProvided = req.query.page !== undefined && req.query.limit !== undefined;

        // Filtering
        const filter = { isDeleted: false, isActive: true };

        if (req.query.searchItem && typeof req.query.searchItem === 'string') {
            filter.$or = [
                { title: { $regex: req.query.searchItem, $options: "i" } },
                { about: { $regex: req.query.searchItem, $options: "i" } },
                { city: { $regex: req.query.searchItem, $options: "i" } },
                { address: { $regex: req.query.searchItem, $options: "i" } },
                { startTime: { $regex: req.query.searchItem, $options: "i" } },
                { endTime: { $regex: req.query.searchItem, $options: "i" } },
                { note: { $regex: req.query.searchItem, $options: "i" } },
                { whyYouAttend: { $regex: req.query.searchItem, $options: "i" } }
            ];
        }

        // Sorting
        const sort = {};
        if (req.query.sortBy && req.query.sortBy.includes(":")) {
            const [field, order] = req.query.sortBy.split(":");
            sort[field] = order === 'desc' ? -1 : 1;
        } else {
            sort["createdAt"] = -1; // Default sorting
        }

        // Aggregation Pipeline
        const aggregationPipeline = [
            { $match: filter },
            {
                $lookup: {
                    from: 'images',
                    localField: 'imageId',
                    foreignField: '_id',
                    as: 'eventImageDetails'
                }
            },
            { $unwind: { path: "$eventImageDetails", preserveNullAndEmptyArrays: true } },
            { $sort: sort },
            {
                $project: {
                    "eventImageDetails.isDeleted": 0
                }
            }
        ];

        // Apply Pagination
        if (isPaginationProvided) {
            aggregationPipeline.push({ $skip: skip }, { $limit: limit });
        }

        // Fetch Events
        const events = await eventCollection.aggregate(aggregationPipeline).toArray();
        const totalEvents = await eventCollection.countDocuments(filter);

        if (events.length === 0) {
            return res.status(404).json({ message: "No Events Found" });
        }

        // Convert image buffer to Base64
        events.forEach(eventObj => {
            if (eventObj.eventImageDetails?.fileBuffer) {
                const base64Image = eventObj.eventImageDetails.fileBuffer.toString('base64');
                eventObj.imageUrl = `data:${eventObj.eventImageDetails.fileType};base64,${base64Image}`;
            }
            delete eventObj.eventImageDetails;
            delete eventObj.isDeleted;
            delete eventObj.isActive;
            delete eventObj.updatedAt;
            delete eventObj.createdAt;
        });

        // Return Response
        return res.json({
            events,
            totalPages: Math.ceil(totalEvents / limit),
            currentPage: page,
            totalEvents
        });

    } catch (error) {
        console.error("Error Fetching Events:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = { createEvent, updateEventById, deleteEventById, getEventById, getAllEvents }

