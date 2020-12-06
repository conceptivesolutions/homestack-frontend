import {mdiChevronDown, mdiChevronRight} from "@mdi/js";
import {Icon} from "@mdi/react";
import classNames from "classnames";
import React from "react";
import Tree, {DefaultNodeProps, Loader} from "react-hyper-tree";
import {TreeView} from "react-hyper-tree/dist/helpers/node";
import styles from "./NavigationTree.module.scss";

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
  icon: string,
  selectable?: boolean,
  iconColor?: string,
  children?: ITreeNode[],
  onSelect?: (selected: boolean) => void,
  hoverIcon?: string,
  hoverIconClick?: () => void,
}

const NavigationTree = (props: INavigationTree) => (
  <div className={classNames(styles.container, props.className)}>
    <Tree
      {...props.required}
      {...props.handlers}
      disableTransitions
      depthGap={20}
      disableLines={true}
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

    onSelect(e);
    if (node.data.onSelect)
      node.data.onSelect(node.isSelected());
  }}>
    {_createControlNode({node, onSelect, onToggle})}
    {node.isLoading() && (<Loader/>)}
    {node.data.icon && <Icon path={node.data.icon} size={0.8} style={{color: node.data.iconColor}} className={styles.icon}/>}
    <span className={styles.text}>{node.data.name}</span>
    {node.data.hoverIcon && <div className={styles.hovericon} onClick={(e) =>
    {
      e.preventDefault();
      node.data.hoverIconClick();
    }}>
      <Icon path={node.data.hoverIcon} size={0.8}/>
    </div>}
  </div>;
}

function _createControlNode({node, onToggle}: DefaultNodeProps)
{
  if (node.options.root)
    return null;

  if (node.hasChildren() || node.options.async)
    if (!node.isLoading())
      return <div onClick={e => onToggle(e as any)}>
        <Icon className={styles.arrow} path={(node.isOpened() && !!node.hasChildren()) ? mdiChevronDown : mdiChevronRight} size={0.8}/>
      </div>

  // dummy
  return <Icon className={styles.arrow} path={mdiChevronRight} size={0.8} color={"transparent"}/>
}
