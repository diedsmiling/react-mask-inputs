import React from 'react';
import { shallow, mount } from 'enzyme';
import uniqueId from '../src/uniqueId';
import { UniqueFieldsWrapper } from '../src/index';

jest.mock('../src/uniqueId', () => {
  let i = 0;
  return () => {
    i++;
    return `fake_unique_id_${i}`
}})

const DumpComponent = () => <div>test</div>

describe('<UniqueFieldsWrapper/>', () => {

  it('should store mappedFields and reversedMappedFields in state', () => {
    const WrappedDumpComponent = UniqueFieldsWrapper(['foo', 'bar'])(DumpComponent)
    const wrapper = mount(<WrappedDumpComponent />)
    expect(wrapper.state('mappedFields'))
      .toEqual({ foo: 'fake_unique_id_1', bar: 'fake_unique_id_2' })
    expect(wrapper.state('reversedMappedFields'))
      .toEqual({ 'fake_unique_id_1': 'foo', 'fake_unique_id_2': 'bar' })
  });

  it('should set correct props', () => {
    const WrappedDumpComponent = UniqueFieldsWrapper(['foo', 'bar'])(DumpComponent)
    const wrapper = mount(<WrappedDumpComponent />)
    expect(wrapper.find(DumpComponent).prop('mappedFields'))
      .toEqual({ foo: 'fake_unique_id_3', bar: 'fake_unique_id_4' })
    expect(wrapper.find(DumpComponent).prop('reversedMappedFields'))
      .toEqual({ 'fake_unique_id_3': 'foo', 'fake_unique_id_4': 'bar' })
    expect(typeof wrapper.find(DumpComponent).prop('getValues'))
      .toEqual('function')
  });

  it('getValues function should return masked values', () => {
    const WrappedDumpComponent = UniqueFieldsWrapper(['foo', 'bar'])(DumpComponent)
    const wrapper = mount(<WrappedDumpComponent />)
    const getValues = wrapper.find(DumpComponent).prop('getValues')
    const values = getValues({
      baz: "quax",
      fake_unique_id_5: "should be foo",
      fake_unique_id_6: "should be bar"
    })
    expect(values).toEqual({
      "baz": "quax",
      "foo": "should be foo",
      "bar": "should be bar"
    })
  });
});
