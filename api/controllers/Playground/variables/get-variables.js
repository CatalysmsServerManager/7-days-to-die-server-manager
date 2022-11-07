module.exports = {
  inputs: {
    serverId: {
      type: 'string',
      required: true,
    },
    page: {
      type: 'number',
      required: true,
    },
    pageSize: {
      type: 'number',
      required: true,
    },
    filteredColumns: {
      type: ['string'],
      required: false,
    },
    columnFilters: {
      type: ['string'],
      required: false,
    },
    sortedColumns: {
      type: ['string'],
      required: false,
    },
    columnSortTypes: {
      type: ['string'],
      required: false,
    },
    searchQuery: {
      type: 'string',
      required: false,
    }
  },


  exits: {},


  fn: async function (inputs, exits) {
    const server = await SdtdServer.findOne({ id: inputs.serverId });

    if (!server) {
      return this.res.status(400).json({
        message: 'Server not found',
      });
    }

    const query = {};

    query['where'] = { server: server.id };

    if (inputs.filteredColumns) {
      if (inputs.filteredColumns !== null && inputs.filteredColumns.length > 0) {
        for (i = 0; i < inputs.filteredColumns.length; i++) {
          if (inputs.filteredColumns[i] !== '') {
            query.where[inputs.filteredColumns[i]] = { contains: inputs.columnFilters[i] };
          }
        }
      }
    }

    if (inputs.searchQuery) {
      if (inputs.searchQuery !== '') {
        query.where['or'] = [{}];

        const columns = ['name', 'value'];

        for (let i = 0; i < columns.length; i++) {
          const search = {};
          search[columns[i]] = { contains: inputs.searchQuery };

          query.where.or[i] = search;
        }
      }
    }

    const totalEntries = await PersistentVariable.count(query);

    if (inputs.sortedColumns) {
      if (inputs.sortedColumns !== null && inputs.sortedColumns.length > 0) {
        if (inputs.sortedColumns.length < 2) {
          if (inputs.sortedColumns[0] !== '') {
            query['sort'] = inputs.sortedColumns[0] + ' ' + inputs.columnSortTypes[0];
          }
        } else {
          query['sort'] = [];

          for (let i = 0; i < inputs.sortedColumns.length; i++) {
            query.sort[inputs.sortedColumns[i]] = inputs.columnSortTypes[i];
          }
        }
      }
    }

    if (inputs.page > 0) {
      query['skip'] = inputs.page * inputs.pageSize;
    }

    query['limit'] = inputs.pageSize;

    sails.log(query);

    const variables = await PersistentVariable.find(query);

    const result = { variables: variables, pageCount: Math.ceil(totalEntries / inputs.pageSize), totalEntries: totalEntries };

    return exits.success({ result });
  }
};
