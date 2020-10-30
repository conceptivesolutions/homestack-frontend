import React from "react";
import styles from "./NavigationTree.module.scss";
import Tree, {DefaultNodeProps, Loader} from "react-hyper-tree";
import classNames from "classnames";
import {TreeView} from "react-hyper-tree/dist/helpers/node";

export interface INavigationTree
{
  required: any,
  handlers: any,
  instance: TreeView,
  className?: string,
}

export interface ITreeNode
{
  id: string,
  name: string,
  iconName: string,
  selectable?: boolean,
  iconColor?: string,
  children?: ITreeNode[],
  onSelect?: (selected: boolean) => void,
}

const NavigationTree = (props: INavigationTree) => (
  <div className={classNames(styles.container, props.className)}>
    <Tree
      {...props.required}
      {...props.handlers}
      disableTransitions
      depthGap={35}
      disableLines={false}
      disableVerticalLines={false}
      draggable={false}
      verticalLineTopOffset={-5}
      verticalLineOffset={15}
      verticalLineStyles={{
        stroke: 'black',
        strokeWidth: 1,
        strokeDasharray: '4 2',
      }}
      horizontalLineStyles={{
        stroke: 'black',
        strokeWidth: 1,
        strokeDasharray: '4 2',
      }}
      renderNode={(renderProps) => _renderNode(props.instance, renderProps)}
    />
  </div>
);

export default NavigationTree;

/**
 * Renders a single node of the tree
 *
 * @param instance
 * @param node
 * @param onSelect
 * @param onToggle
 */
function _renderNode(instance: TreeView, {node, onSelect, onToggle}: DefaultNodeProps)
{
  return <div className={classNames(styles.node, {
    [styles.root]: node.options.root,
    [styles.nodeSelectable]: node.data.selectable,
    [styles.nodeSelected]: node.options.selected,
  })} onClick={(e) =>
  {
    if (!node.data.selectable)
      return;

    instance.unselectAll();
    onSelect(e);

    if (node.data.onSelect)
      node.data.onSelect(node.isSelected());
  }}>
    {_createControlNode({node, onSelect, onToggle})}
    {node.isLoading() && (<Loader/>)}
    {node.data.iconName && <span style={{color: node.data.iconColor}} className={styles.icon + " fa fa-" + node.data.iconName}/>}
    <span className={styles.text}>{node.data.name}</span>
  </div>;
}

function _createControlNode({node, onToggle}: DefaultNodeProps)
{
  if (node.options.root)
    return null;

  if (node.hasChildren() || node.options.async)
    if (!node.isLoading())
      return <span onClick={onToggle}
                   className={classNames(styles.arrow, "fa", {
                     "fa-minus-square": node.isOpened() && !!node.hasChildren(),
                     "fa-plus-square": !(node.isOpened() && !!node.hasChildren())
                   })}/>;

  // dummy
  return <span className={styles.arrow}/>
}
