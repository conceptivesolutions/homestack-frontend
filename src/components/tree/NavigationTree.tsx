import React from "react";
import "./NavigationTree.scss";
import Tree, {Loader} from "react-hyper-tree";

export interface INavigationTree
{
  required: any,
  handlers: any,
}

export default (props: INavigationTree) => (
  <div className={"component-tree__container"}>
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
function _renderNode({node, onSelect, onToggle}: any)
{
  if (node.options.root)
    console.log(node)
  return <div className={"component-tree__node " + (node.options.root && "component-tree__node-root")} onClick={onSelect}>
    {_createControlNode({node, onToggle})}
    {node.isLoading() && (<Loader/>)}
    {node.data.iconName && <span className={"component-tree__node-icon fa fa-" + node.data.iconName}/>}
    <span className={"component-tree__node-text"}>{node.data.name}</span>
  </div>;
}

function _createControlNode({node, onToggle}: any)
{
  if (node.options.root)
    return null;

  if (node.hasChildren() || node.options.async)
    if (!node.isLoading())
      return <span onClick={onToggle}
                   className={"component-tree__node-arrow fa fa-" + (node.isOpened() && !!node.hasChildren() ? "minus-square" : "plus-square")}/>;

  // dummy
  return <span className={"component-tree__node-arrow"}/>
}
