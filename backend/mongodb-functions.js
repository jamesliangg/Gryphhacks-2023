import {MongoClient} from "mongodb";

const uri = process.env.MONGO_CONNECT_STRING;

export async function mongoQueryOne(queryKey, queryValue, mongoDatabase, mongoCollection) {
    const client = new MongoClient(uri);
    let queryResult = "Error in query";
    try {
        const database = client.db(mongoDatabase);
        const collection = database.collection(mongoCollection);

        const query = { [queryKey]: queryValue };
        queryResult = await collection.findOne(query);

        // console.log(queryResult);
    } catch(err) {
        queryResult = err.message;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        return queryResult;
    }
}

export async function mongoQueryMultiple(queryArray, mongoDatabase, mongoCollection) {
    const client = new MongoClient(uri);
    let queryResult = "Error in query";
    try {
        const database = client.db(mongoDatabase);

        let queryObject = {};
        for (const i in queryArray) {
            Object.assign(queryObject, {[queryArray[i][0]]: {$gte : queryArray[i][1], $lte : queryArray[i][2]}});
        }

        const collection = database.collection(mongoCollection);
        queryResult = await collection.find(queryObject).toArray();

        // console.log(queryResult);
    } catch(err) {
        queryResult = err.message;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        return queryResult;
    }
}

export async function mongoInsertOne(input, mongoDatabase, mongoCollection) {
    const client = new MongoClient(uri);
    let insertResult = "Error in insert";
    try {
        const database = client.db(mongoDatabase);
        const collection = database.collection(mongoCollection);

        let insert = {};
        Object.assign(insert, input);

        insertResult = await collection.insertOne(insert);

        // console.log(insertResult);
    } catch(err) {
        insertResult = err.message;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        return insertResult;
    }
}

export async function mongoFindDuplicate(queryKey, queryValue, mongoDatabase, mongoCollection) {
    const client = new MongoClient(uri);
    let queryResult = "Error in query";
    try {
        const database = client.db(mongoDatabase);
        const collection = database.collection(mongoCollection);

        const query = { [queryKey]: queryValue };
        queryResult = await collection.countDocuments(query);


        // console.log(queryResult);
    } catch(err) {
        queryResult = err.message;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        return queryResult;
    }
}

export async function mongoCountCrimes(queryArray, mongoDatabase, mongoCollection) {
    const client = new MongoClient(uri);
    let queryResult = "Error in query";
    try {
        const database = client.db(mongoDatabase);

        let queryObject = {};
        for (const i in queryArray) {
            Object.assign(queryObject, {[queryArray[i][0]]: {$gte : queryArray[i][1], $lte : queryArray[i][2]}});
        }

        const collection = database.collection(mongoCollection);
        queryResult = await collection.countDocuments(queryObject);
        // console.log(queryResult);
    } catch(err) {
        queryResult = err.message;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        return queryResult;
    }
}

export async function mongoSortCrimes(queryArray, mongoDatabase, mongoCollection) {
    const client = new MongoClient(uri);
    let queryResult = "Error in query";
    try {
        const database = client.db(mongoDatabase);

        let queryObject = {};
        for (const i in queryArray) {
            if (queryArray[i].length == 3) {
                Object.assign(queryObject, {[queryArray[i][0]]: {$gte : queryArray[i][1], $lte : queryArray[i][2]}});
            }
            else {
                Object.assign(queryObject, {[queryArray[i][0]]: queryArray[i][1]});
            }
        }

        const collection = database.collection(mongoCollection);

        queryResult = await collection.aggregate([
            { $match: queryObject},
            { $group : { _id : '$MCI_CATEGORY', count : {$sum : 1}}}
        ]).toArray();

    } catch(err) {
        queryResult = err.message;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        return queryResult;
    }
}