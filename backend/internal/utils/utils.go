package utils

import (
	"slices"
	"strings"

	"github.com/pavece/stackON/internal/repositories/webhook"
)

func ConvertNodesToInstructionSet(nodes []webhook.InstructionNode, edges []webhook.InstructionConnection) []string {
	if len(nodes) == 0 || len(edges) == 0 {
		return []string{"NO INSTRUCTIONS"}
	}

	instructionSet := make([]string, 0, 10)

	currentNode := nodes[0].Id

	for len(edges) > 0 {
		currentEdgeIdx := indexOfEdgeByStart(currentNode, edges)
		if currentEdgeIdx < 0 {
			return instructionSet
		}

		instruction, err := findInstructionById(currentNode, nodes)
		if err != nil {
			return instructionSet
		}

		instructionSet = append(instructionSet, strings.ToUpper(instruction.Data.Instruction))
		currentNode = edges[currentEdgeIdx].Target

		edges = slices.Delete(edges, currentEdgeIdx, currentEdgeIdx+1)

		if len(edges) < 1 {
			instruction, err := findInstructionById(currentNode, nodes)
			if err != nil {
				return instructionSet
			}

			instructionSet = append(instructionSet, strings.ToUpper(instruction.Data.Instruction))
		}
	}

	return instructionSet
}

func indexOfEdgeByStart(start string, edges []webhook.InstructionConnection) int {
	for i, e := range edges {
		if e.Source == start {
			return i
		}
	}
	return -1
}

func findInstructionById(id string, instructions []webhook.InstructionNode) (webhook.InstructionNode, error) {
	for _, in := range instructions {
		if in.Id == id {
			return in, nil
		}
	}

	return webhook.InstructionNode{}, nil
}