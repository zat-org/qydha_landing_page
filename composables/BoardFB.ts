import { doc, Firestore, getDoc, setDoc, updateDoc } from "firebase/firestore";
export interface TableData {
  id: string;
  dimension: {
    width: string;
    height: string;
  };
  scorePanel: {
    topMargin: string;
    width: string;
    height: string;
    leftTeam: {
      name: {
        size: string;
        top: string;
        left: string;
      };
      score: {
        size: string;
        top: string;
        left: string;
      };
    };
    rightTeam: {
      name: {
        size: string;
        top: string;
        left: string;
      };
      score: {
        size: string;
        top: string;
        left: string;
      };
    };
    position: {
      scale: number;
      left: string;
      top: string;
    };
  };
  LeftPlayer: { top: string; left: string };
  RightPlayer: { top: string; right: string };
  BottomPlayer: { bottom: string; left: string };
  PlayerImageWidth: number;
  DetailScore:{
    Color: string;
    FontSize: string;
  }

}
export interface TableUpdate {
  dimension: {
    width: number;
    height: number;
  };
  scorePanel: {
    topMargin: number;
    height: number;
    position: {
      scale: number;
      left: number;
      top: number;
    };
    leftTeam: {
      name: {
        size: number;
        top: number;
        left: number;
      };
      score: {
        size: number;
        top: number;
        left: number;
      };
    };
    rightTeam: {
      name: {
        size: number;
        top: number;
        left: number;
      };
      score: {
        size: number;
        top: number;
        left: number;
      };
    };
  };
  LeftPlayer: { top: number; left: number };
  RightPlayer: { top: number; right: number };
  BottomPlayer: { bottom: number; left: number };
  PlayerImageWidth: number;
  DetailScore:{Color: string; FontSize: number;}

}
export const useBoardFB = () => {
  const { $firestore } = useNuxtApp()
  // $firestore.app
  const getOrCreateTable = async (tableId: string): Promise<TableData> => {
    // console.log($firestore.app)
    const tableRef = doc($firestore as Firestore , "tables", tableId);
    const tableSnap = await getDoc(tableRef);

    if (tableSnap.exists()) {
      return {
        ...(tableSnap.data() as TableData),
      };
    }


    const defaultTableData: TableData = {
      id: "",
      PlayerImageWidth: 200,
      dimension: { width: "1080px", height: "1920px" },
      scorePanel: {
        topMargin: "0px",
        width: "1080px",
        height: "300px",
        position: {
          scale: 0.9,
          left: "-14px",
          top: "0px",
        },
        leftTeam: {
          name: {
            size: "30px",
            top: "0px",
            left: "0px",
  
          },
          score: {
            size: "50px",
            top: "0px",
            left: "0px",
  
          },
        },
        rightTeam: {
          name: {
            size: "30px",
            top: "0px",
            left: "0px",
  
          },
          score: {
            size: "50px",
            top: "0px",
            left: "0px",
  
          },
        },
      },
      LeftPlayer: { top: "calc(50% - 30px)", left: "0px" },
      RightPlayer: { top: "calc(50% - 30px)", right: "0px" },
      BottomPlayer: { bottom: "0px", left: "calc(50% - 30px)" },
      DetailScore:{Color:"#000000" , FontSize:"50px"},
    };
    defaultTableData.LeftPlayer.top = ` ${
      defaultTableData.PlayerImageWidth / 2
    }px`;
    defaultTableData.RightPlayer.top = `  ${
      defaultTableData.PlayerImageWidth / 2
    }px`;
    defaultTableData.BottomPlayer.left = `  ${
      defaultTableData.PlayerImageWidth / 2
    }px`;
  


    // Create new document if it doesn't exist
    await setDoc(tableRef, defaultTableData);
    return defaultTableData;
  };

  const updateTable = async (
    tableId: string,
    newData: TableUpdate
  ): Promise<
    { success: boolean; data: TableData } | { success: boolean; error: any }
  > => {
    const tableRef = doc($firestore as Firestore, "tables", tableId);
    const newTable: TableData = {
      id: tableId,
      PlayerImageWidth: newData.PlayerImageWidth,
      dimension: {
        width: `${newData.dimension.width}px`,
        height: `${newData.dimension.height}px`,
      },
      scorePanel: {
        topMargin: `${newData.scorePanel.topMargin}px`,
        width: `${newData.dimension.width}px`,
        height: `${newData.scorePanel.height}px`,
        leftTeam: {
          name: {
            size: `${newData.scorePanel.leftTeam.name.size}px`,
            top: `${newData.scorePanel.leftTeam.name.top}px`,
            left: `${newData.scorePanel.leftTeam.name.left}px`,

          },
          score: {
            size: `${newData.scorePanel.leftTeam.score.size}px`,
            top: `${newData.scorePanel.leftTeam.score.top}px`,
            left: `${newData.scorePanel.leftTeam.score.left}px`,

          },
        },
        rightTeam: {
          name: {
            size: `${newData.scorePanel.rightTeam.name.size}px`,
            top: `${newData.scorePanel.rightTeam.name.top}px`,
            left: `${newData.scorePanel.rightTeam.name.left}px`,
           },
          score: {
            size: `${newData.scorePanel.rightTeam.score.size}px`,
            top: `${newData.scorePanel.rightTeam.score.top}px`,
            left: `${newData.scorePanel.rightTeam.score.left}px`,
 
          },
        },
        position: {
          scale: newData.scorePanel.position.scale,
          left: `${newData.scorePanel.position.left}px`,
          top: `${newData.scorePanel.position.top}px`,
        },
      },
      LeftPlayer: {
        top: `${newData.LeftPlayer.top}px`,
        left: `${newData.LeftPlayer.left}px`,
      },
      RightPlayer: {
        top: `${newData.RightPlayer.top}px`,
        right: `${newData.RightPlayer.right}px`,
      },
      BottomPlayer: {
        bottom: `${newData.BottomPlayer.bottom}px`,
        left: ` ${newData.BottomPlayer.left}px`,
      },
      DetailScore:{
        Color: newData.DetailScore.Color,
        FontSize: `${newData.DetailScore.FontSize}px`,
      }
    };

    try {
      await updateDoc(tableRef, {
        ...newTable,
      });
      return {
        success: true,
        data: newTable,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  };
  return { getOrCreateTable, updateTable };
};
