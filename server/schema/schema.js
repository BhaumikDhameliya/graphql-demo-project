const Note = require("../models/Note");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");

// Note Type
const NoteType = new GraphQLObjectType({
  name: "Note",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    tag: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    notes: {
      type: new GraphQLList(NoteType),
      args: {
        limit: { type: GraphQLInt },
        skip: { type: GraphQLInt },
        search: { type: GraphQLString },
        tag: { type: GraphQLString },
      },
      async resolve(parent, args) {
        let { limit, skip, search, tag } = args;
        if (search) skip = 0;
        const notes = await Note.find({ tag: new RegExp(tag, "i") })
          .or([
            { title: new RegExp(search, "i") },
            { description: new RegExp(search, "i") },
            { tag: new RegExp(search, "i") },
          ])
          .limit(parseInt(limit))
          .skip(parseInt(skip));
        return notes;
      },
    },
    note: {
      type: NoteType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Note.findById(args.id);
      },
    },
    totalNotesCount: {
      type: GraphQLInt,
      args: { search: { type: GraphQLString }, tag: { type: GraphQLString } },
      async resolve(parent, args) {
        const { search = "", tag = "" } = args;
        const count = await Note.find({ tag: new RegExp(tag, "i") })
          .or([
            { title: new RegExp(search, "i") },
            { description: new RegExp(search, "i") },
            { tag: new RegExp(search, "i") },
          ])
          .count();
        return count;
      },
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      args: {},
      async resolve(parent, args) {
        const tags = await Note.find().distinct("tag");
        return tags;
      },
    },
  },
});

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Add a note
    addNote: {
      type: NoteType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        tag: { type: GraphQLString },
      },
      resolve(parent, args) {
        const note = new Note({
          title: args.title,
          description: args.description,
          tag: args.tag,
        });

        return note.save();
      },
    },

    // Delete a note
    deleteNote: {
      type: NoteType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Note.findByIdAndRemove(args.id);
      },
    },

    // Update a note
    updateNote: {
      type: NoteType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        tag: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Note.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
              tag: args.tag,
            },
          },
          { new: true }
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
