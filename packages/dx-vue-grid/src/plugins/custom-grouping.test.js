import { mount } from '@vue/test-utils';
import { setupConsole } from '@devexpress/dx-testing';
import {
  groupRowChecker,
  groupRowLevelKeyGetter,
  groupCollapsedRowsGetter,
  customGroupingRowIdGetter,
  customGroupedRows,
  expandedGroupRows,
} from '@devexpress/dx-grid-core';
import { PluginHost } from '@devexpress/dx-vue-core';
import { CustomGrouping } from './custom-grouping';
import { PluginDepsToComponents, getComputedState } from './test-utils';

jest.mock('@devexpress/dx-grid-core', () => ({
  groupRowChecker: jest.fn(),
  groupRowLevelKeyGetter: jest.fn(),
  groupCollapsedRowsGetter: jest.fn(),
  customGroupingRowIdGetter: jest.fn(),
  customGroupedRows: jest.fn(),
  expandedGroupRows: jest.fn(),
}));

const defaultDeps = {
  getter: {
    rows: [{ id: 0 }, { id: 1 }],
    grouping: [{ columnName: 'a' }],
    expandedGroups: ['A', 'B'],
    getRowId: () => { },
  },
  plugins: ['GroupingState'],
};

const defaultProps = {
  getChildGroups: () => { },
};

describe('CustomGrouping', () => {
  let resetConsole;
  beforeAll(() => {
    resetConsole = setupConsole({ ignore: ['validateDOMNesting'] });
  });
  afterAll(() => {
    resetConsole();
  });

  beforeEach(() => {
    groupRowChecker.mockImplementation(() => 'groupRowChecker');
    groupRowLevelKeyGetter.mockImplementation(() => 'groupRowLevelKeyGetter');
    groupCollapsedRowsGetter.mockImplementation(() => 'groupCollapsedRowsGetter');
    customGroupingRowIdGetter.mockImplementation(() => 'customGroupingRowIdGetter');
    customGroupedRows.mockImplementation(() => 'customGroupedRows');
    expandedGroupRows.mockImplementation(() => 'expandedGroupRows');
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should provide isGroupRow getter', () => {
    const tree = mount({
      render() {
        return (
          <PluginHost>
            <PluginDepsToComponents deps={defaultDeps} />
            <CustomGrouping
              {...{ attrs: { ...defaultProps } }}
            />
          </PluginHost>
        );
      },
    });

    expect(getComputedState(tree).isGroupRow)
      .toBe(groupRowChecker);
  });

  it('should provide getRowLevelKey getter', () => {
    const tree = mount({
      render() {
        return (
          <PluginHost>
            <PluginDepsToComponents deps={defaultDeps} />
            <CustomGrouping
              {...{ attrs: { ...defaultProps } }}
            />
          </PluginHost>
        );
      },
    });

    expect(getComputedState(tree).getRowLevelKey)
      .toBe(groupRowLevelKeyGetter);
  });

  it('should provide rows getter based on grouping and expandedGroups getters', () => {
    const tree = mount({
      render() {
        return (
          <PluginHost>
            <PluginDepsToComponents deps={defaultDeps} />
            <CustomGrouping
              {...{ attrs: { ...defaultProps } }}
            />
          </PluginHost>
        );
      },
    });

    expect(customGroupedRows)
      .toBeCalledWith(
        defaultDeps.getter.rows,
        defaultDeps.getter.grouping,
        defaultProps.getChildGroups,
      );

    expect(expandedGroupRows)
      .toBeCalledWith(
        customGroupedRows(),
        defaultDeps.getter.grouping,
        defaultDeps.getter.expandedGroups,
      );

    expect(getComputedState(tree).rows)
      .toBe(expandedGroupRows());
  });

  it('should provide getRowId getter based on grouped rows', () => {
    const tree = mount({
      render() {
        return (
          <PluginHost>
            <PluginDepsToComponents deps={defaultDeps} />
            <CustomGrouping
              {...{ attrs: { ...defaultProps } }}
            />
          </PluginHost>
        );
      },
    });

    expect(customGroupingRowIdGetter)
      .toBeCalledWith(
        defaultDeps.getter.getRowId,
        customGroupedRows(),
      );

    expect(getComputedState(tree).getRowId)
      .toBe(customGroupingRowIdGetter());
  });

  it('should provide getCollapsedRows getter', () => {
    const deps = {
      getter: {
        getCollapsedRows: () => { },
      },
    };
    const tree = mount({
      render() {
        return (
          <PluginHost>
            <PluginDepsToComponents deps={defaultDeps} depsOverrides={deps} />
            <CustomGrouping
              {...{ attrs: { ...defaultProps } }}
            />
          </PluginHost>
        );
      },
    });

    expect(getComputedState(tree).getCollapsedRows)
      .toBe(groupCollapsedRowsGetter());

    expect(groupCollapsedRowsGetter)
      .toBeCalledWith(deps.getter.getCollapsedRows);
  });

  describe('temporary grouping', () => {
    it('should provide grouping and expanded groups based on grouping and expandedGroups properties', () => {
      const grouping = [{ columnName: 'a' }];
      const expandedGroups = ['a', 'b'];

      const tree = mount({
        render() {
          return (
            <PluginHost>
              <PluginDepsToComponents deps={defaultDeps} />
              <CustomGrouping
                {...{ attrs: { ...defaultProps } }}
                grouping={grouping}
                expandedGroups={expandedGroups}
              />
            </PluginHost>
          );
        },
      });

      expect(getComputedState(tree).grouping)
        .toEqual(grouping);
      expect(getComputedState(tree).expandedGroups)
        .toEqual(expandedGroups);
    });

    it('should provide rows getter based on grouping and expandedGroups properties', () => {
      const grouping = [{ columnName: 'a' }];
      const expandedGroups = ['a', 'b'];

      const tree = mount({
        render() {
          return (
            <PluginHost>
              <PluginDepsToComponents deps={defaultDeps} />
              <CustomGrouping
                {...{ attrs: { ...defaultProps } }}
                grouping={grouping}
                expandedGroups={expandedGroups}
              />
            </PluginHost>
          );
        },
      });

      expect(customGroupedRows)
        .toBeCalledWith(
          defaultDeps.getter.rows,
          grouping,
          defaultProps.getChildGroups,
        );

      expect(expandedGroupRows)
        .toBeCalledWith(
          customGroupedRows(),
          grouping,
          expandedGroups,
        );

      expect(getComputedState(tree).rows)
        .toBe(expandedGroupRows());
    });
  });
});
