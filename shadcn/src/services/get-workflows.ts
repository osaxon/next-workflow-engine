import type { IFlowState } from "@/stores/flow-store";

export const getWorkflows = async (): Promise<IFlowState["workflow"][]> => {
  // TODO: replace with actual data
  return [
    {
      id: "1",
      name: "Initial Workflow",
      edges: [
        {
          id: "27Uqm_guQgYOw81_ibdSu",
          source: "rFM8ixvItA-i-bXblxZ_M",
          target: "nESW80juDe8b5bB_tbmSc",
          type: "deletable",
        },
        {
          id: "aiMB_q-I713SLcttfM6PS",
          source: "nESW80juDe8b5bB_tbmSc",
          target: "5zne5FShP-jUCF1s7823h",
          type: "deletable",
        },
        {
          id: "gqnkF2AYRxqf8QUiZHuyr",
          source: "5zne5FShP-jUCF1s7823h",
          target: "8p15_Y66luCEbFS_J7vcO",
          type: "deletable",
        },
        {
          id: "AKIsmctF2xPTVcEGZgwBn",
          source: "8p15_Y66luCEbFS_J7vcO",
          target: "DtJ7scXmGEA101ommJOKc",
          type: "deletable",
        },
        {
          id: "wEgmkVqjI5s2VH32FIMvX",
          source: "nESW80juDe8b5bB_tbmSc",
          target: "9BP0qBxoQ70DKRq8gC1GX",
          type: "deletable",
        },
        {
          id: "VY2MoIexgvwqn-h8NU2Rp",
          source: "9BP0qBxoQ70DKRq8gC1GX",
          target: "F1zbrjG2vqeDEFElu1478",
          type: "deletable",
        },
        {
          id: "nCaxSFN8ZGR_o23Y6M7PA",
          source: "F1zbrjG2vqeDEFElu1478",
          target: "DtJ7scXmGEA101ommJOKc",
          type: "deletable",
        },
        {
          id: "K9n9h4MV4dpHMbrTstf48",
          source: "nESW80juDe8b5bB_tbmSc",
          target: "Z-jW1DqKIqpw1SDVMnkra",
          type: "deletable",
        },
        {
          id: "bnm75BAIbdRkozdO7sE3I",
          source: "Z-jW1DqKIqpw1SDVMnkra",
          target: "ORKuDH3QHalm-h0zs8zd_",
          type: "deletable",
        },
        {
          id: "SJVanPsTtjJSaTJ4_mJQK",
          source: "ORKuDH3QHalm-h0zs8zd_",
          target: "DtJ7scXmGEA101ommJOKc",
          type: "deletable",
        },
      ],
      nodes: [
        {
          id: "rFM8ixvItA-i-bXblxZ_M",
          type: "start",
          position: {
            x: 0,
            y: 267,
          },
          deletable: false,
          data: {
            label: "Start",
            deletable: false,
          },

          measured: {
            width: 96,
            height: 42,
          },
        },
        {
          id: "DtJ7scXmGEA101ommJOKc",
          type: "end",
          position: {
            x: 1440,
            y: 272,
          },
          deletable: false,
          data: {
            label: "End",
            deletable: true,
          },
          measured: {
            width: 90,
            height: 42,
          },
        },
        {
          id: "5zne5FShP-jUCF1s7823h",
          type: "tags",
          position: {
            x: 592,
            y: -42,
          },
          deletable: false,
          data: {
            tags: ["marketing", "lead"],
          },

          measured: {
            width: 288,
            height: 186,
          },
        },
        {
          id: "nESW80juDe8b5bB_tbmSc",
          type: "menu",
          position: {
            x: 192,
            y: 96,
          },
          deletable: false,
          data: {
            options: [
              {
                id: "VDzoZ8Zy7ziN7Lk7-oCyr",
                option: {
                  id: 0,
                  value: "Marketing",
                },
              },
              {
                id: "oSWr4M-TyKs9xBYAFd1_R",
                option: {
                  id: 1,
                  value: "Lead",
                },
              },
              {
                id: "loCnMZeGPetaibXqZGyhp",
                option: {
                  id: 2,
                  value: "Support",
                },
              },
            ],
            question: "Please select an option:",
          },
          measured: {
            width: 288,
            height: 348,
          },
        },
        {
          id: "8p15_Y66luCEbFS_J7vcO",
          type: "text-message",
          position: {
            x: 992,
            y: 0,
          },
          deletable: false,
          data: {
            message: "You choose Marketing.",
          },
          measured: {
            width: 288,
            height: 199,
          },
        },
        {
          id: "9BP0qBxoQ70DKRq8gC1GX",
          type: "tags",
          position: {
            x: 592,
            y: 208,
          },
          deletable: false,
          data: {
            tags: ["lead"],
          },
          measured: {
            width: 288,
            height: 186,
          },
        },
        {
          id: "F1zbrjG2vqeDEFElu1478",
          type: "text-message",
          position: {
            x: 1024,
            y: 304,
          },
          deletable: false,
          data: {
            message: "You choose Lead.",
          },
          measured: {
            width: 288,
            height: 179,
          },
        },
        {
          id: "Z-jW1DqKIqpw1SDVMnkra",
          type: "tags",
          position: {
            x: 592,
            y: 432,
          },
          deletable: false,
          data: {
            tags: ["support"],
          },
          measured: {
            width: 288,
            height: 186,
          },
        },
        {
          id: "ORKuDH3QHalm-h0zs8zd_",
          type: "text-message",
          position: {
            x: 1040,
            y: 528,
          },
          deletable: false,
          data: {
            message: "You choose Support.",
          },
          measured: {
            width: 288,
            height: 179,
          },
        },
      ],
      sidebar: {
        active: "available-nodes",
        panels: {
          nodeProperties: {
            selectedNode: null,
          },
        },
      },
    },
  ];
};
