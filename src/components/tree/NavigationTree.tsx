import React from "react";
import "./NavigationTree.scss";
import Tree, {DefaultNodeProps, Loader} from "react-hyper-tree";
import classNames from "classnames";

export interface INavigationTree
{
  required: any,
  handlers: any,
  className?: string,
}

export interface ITreeNode
{
  id: string,
  name: string,
  iconName: string,
  iconColor?: string,
  children?: ITreeNode[],
}

export default (props: INavigationTree) => (
  <div className={classNames("component-tree__container", props.className)}>
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
      renderNode={_renderNode}
    />
  </div>
)

/**
 * Renders a single node of the tree
 *
 * @param node
 * @param onSelect
 * @param onToggle
 */
function _renderNode({node, onSelect, onToggle}: DefaultNodeProps)
{
  return <div className={classNames("component-tree__node", {"component-tree__node-root": node.options.root})} onClick={onSelect}>
    {_createControlNode({node, onSelect, onToggle})}
    {node.isLoading() && (<Loader/>)}
    {node.data.iconName && <span style={{color: node.data.iconColor}} className={"component-tree__node-icon fa fa-" + node.data.iconName}/>}
    <span className={"component-tree__node-text"}>{node.data.name}</span>
  </div>;
}

function _createControlNode({node, onToggle}: DefaultNodeProps)
{
  if (node.options.root)
    return null;

  if (node.hasChildren() || node.options.async)
    if (!node.isLoading())
      return <span onClick={onToggle}
                   className={classNames("component-tree__node-arrow", "fa", {
                     "fa-minus-square": node.isOpened() && !!node.hasChildren(),
                     "fa-plus-square": !(node.isOpened() && !!node.hasChildren())
                   })}/>;

  // dummy
  return <span className={"component-tree__node-arrow"}/>
}
