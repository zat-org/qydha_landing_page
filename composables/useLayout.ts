import dagre from "@dagrejs/dagre";
import { Position } from "@vue-flow/core";
import type { Node, Edge } from "@vue-flow/core";
import type { Match } from "~/models/group";

type GraphDirection = "LR" | "LRC";
interface GraphData {
  nodes: Node<any, any, string>[];
  edges: Edge<any, any, string>[];
}

export function useLayout() {
  const CreateDagreGraph = (direction: GraphDirection) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({
      rankdir: direction,
      nodesep: 10,
    });
    return dagreGraph;
  };

  function layoutFromMatchesTree(
    matchesHeads: Match[],
    loserMatches: Match[],
    direction: GraphDirection
  ) {
    let graphData: GraphData = { nodes: [], edges: [] };
    let dagreGraph = CreateDagreGraph("LR");

    const createMatchEdge = (
      sourceId: number,
      targetId: number
    ): Edge<any, any, string> => {
      let edge = {
        id: `${sourceId.toString()} => ${targetId.toString()}`,
        source: sourceId.toString(),
        target: targetId.toString(),
      };
      graphData.edges.push(edge);
      dagreGraph.setEdge(edge.source, edge.target);
      return edge;
    };

    const createMatchNode = (
      match: Match,
      isInUsTree: boolean = false
    ): Node<any, any, string> => {
      let node = {
        id: match.id.toString(),
        data: {
          match,
          directions: {
            source: Position.Right,
            target: Position.Left,
            isInUsTree,
          },
        },
        type: "match",
        draggable: false,
        position: { x: 0, y: 0 },
      };
      graphData.nodes.push(node);
      dagreGraph.setNode(node.id.toString(), {
        width: 300,
        height: 86,
      });
      return node;
    };
    if (direction === "LR")
      matchesHeads.forEach((head) => {
        let matches: Match[] = [head];
        while (matches.length > 0) {
          let match = matches.pop();
          if (!match) break;
          createMatchNode(match);
          if (match.matchQualifyThemTeam) {
            matches.push(match.matchQualifyThemTeam);
            createMatchEdge(match.matchQualifyThemTeam.id, match.id);
          }
          if (match.matchQualifyUsTeam) {
            matches.push(match.matchQualifyUsTeam);
            createMatchEdge(match.matchQualifyUsTeam.id, match.id);
          }
        }
      });
    else if (direction === "LRC") {
      matchesHeads.forEach((head) => {
        createMatchNode(head);

        let matches: Match[] = [];
        if (head.matchQualifyThemTeam) {
          createMatchEdge(head.matchQualifyThemTeam.id, head.id);
          if (
            !graphData.nodes.find(
              (m) => m.id === head.matchQualifyThemTeam!.id.toString()
            )
          ) {
            matches.push(head.matchQualifyThemTeam);
            while (matches.length > 0) {
              let match = matches.pop();
              if (!match) break;
              createMatchNode(match);
              if (match.matchQualifyThemTeam) {
                matches.push(match.matchQualifyThemTeam);
                createMatchEdge(match.matchQualifyThemTeam.id, match.id);
              }
              if (match.matchQualifyUsTeam) {
                matches.push(match.matchQualifyUsTeam);
                createMatchEdge(match.matchQualifyUsTeam.id, match.id);
              }
            }
          }
        }
        if (head.matchQualifyUsTeam) {
          createMatchEdge(head.id, head.matchQualifyUsTeam.id);
          if (
            !graphData.nodes.find(
              (m) => m.id === head.matchQualifyUsTeam!.id.toString()
            )
          ) {
            matches.push(head.matchQualifyUsTeam);
            while (matches.length > 0) {
              let match = matches.pop();
              if (!match) break;
              createMatchNode(match, true);
              if (match.matchQualifyThemTeam) {
                matches.push(match.matchQualifyThemTeam);
                createMatchEdge(match.id, match.matchQualifyThemTeam.id);
              }
              if (match.matchQualifyUsTeam) {
                matches.push(match.matchQualifyUsTeam);
                createMatchEdge(match.id, match.matchQualifyUsTeam.id);
              }
            }
          }
        }
      });
      loserMatches.forEach((m) => {
        createMatchNode(m);
        createMatchEdge(m.matchQualifyThemTeamId!, m.id);
        createMatchEdge(m.id, m.matchQualifyUsTeamId!);
      });
    }
    dagre.layout(dagreGraph);
    return {
      nodes: graphData.nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
          ...node,
          position: { x: nodeWithPosition.x, y: nodeWithPosition.y },
        };
      }),
      edges: graphData.edges,
    };
  }

  return { layoutFromMatchesTree };
}