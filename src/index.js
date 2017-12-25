import React, { Component } from 'react';
import uniqueId from './uniqueId';

var a = 'aa';

export default function GetMaskedFieldsWrapper(fields) {
  return function wrapComponent(ChildComponent) {
    return class MaskedFieldsWrapper extends Component {
      state = {
        mappedFields: [],
        reversedMappedFields: []
      }

      componentWillMount() {
        const mappedFields = {};
        const reversedMappedFields = {};
        fields.forEach((field) => {
          const newName = uniqueId();
          mappedFields[field] = newName;
          reversedMappedFields[newName] = field;
        });
        this.setState({ mappedFields, reversedMappedFields });
      }

      getValues = (values) => {
        const keys = Object.keys(values);
        if (keys.length === 0) return {};

        return keys.reduce((acc, cur) => {
          if (this.state.reversedMappedFields[cur]) {
            acc[this.state.reversedMappedFields[cur]] = values[cur];
          } else {
            acc[cur] = values[cur];
          }

          return acc;
        }, {});
      }

      render() {
        return (
          <ChildComponent
            getValues={this.getValues}
            mappedFields={this.state.mappedFields}
            reversedMappedFields={this.state.reversedMappedFields}
            {...this.props}
          />
        );
      }
    };
  };
}
