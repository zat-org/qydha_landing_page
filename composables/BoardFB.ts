import { useFirestore } from "vuefire";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { bottom } from "@popperjs/core";
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
        width: string;
        height: string;
      };
      score: {
        size: string;
        top: string;
        left: string;
        width: string;
        height: string;
      };
    };
    rightTeam: {
      name: {
        size: string;
        top: string;
        left: string;
        width: string;
        height: string;
      };
      score: {
        size: string;
        top: string;
        left: string;
        width: string;
        height: string;
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
  DetailScoreColor: string;
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
        width: number;
        height: number;
      };
      score: {
        size: number;
        top: number;
        left: number;
        width: number;
        height: number;
      };
    };
    rightTeam: {
      name: {
        size: number;
        top: number;
        left: number;
        width: number;
        height: number;
      };
      score: {
        size: number;
        top: number;
        left: number;
        width: number;
        height: number;
      };
    };
  };
  LeftPlayer: { top: number; left: number };
  RightPlayer: { top: number; right: number };
  BottomPlayer: { bottom: number; left: number };
  PlayerImageWidth: number;
  DetailScoreColor: string;
}
export const useBoardFB = () => {
  // const balootApp = initializeApp({
  //   // Your Firebase config
  // }, 'baloot-boards')
  //  useFirebaseApp('baloot-boards')

  const db = useFirestore();

  const getOrCreateTable = async (tableId: string): Promise<TableData> => {
    const tableRef = doc(db, "tables", tableId);
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
            size: "25px",
            top: "73px",
            left: "111px",
            width: "50%",
            height: "100px",
          },
          score: {
            size: "47px",
            top: "66px",
            left: "414px",
            width: "20%",
            height: "100px",
          },
        },
        rightTeam: {
          name: {
            size: "25px",
            top: "73px",
            left: "188px",
            width: "50%",
            height: "100px",
          },
          score: {
            size: "47px",
            top: "66px",
            left: "43px",
            width: "20%",
            height: "100px",
          },
        },
      },
      LeftPlayer: { top: "", left: "0px" },
      RightPlayer: { top: "", right: "0px" },
      BottomPlayer: { bottom: "0px", left: "" },
      DetailScoreColor: "#000000",
    };
    defaultTableData.LeftPlayer.top = ` ${
      defaultTableData.PlayerImageWidth / 2
    }px`;
    defaultTableData.RightPlayer.top = ` ${
      defaultTableData.PlayerImageWidth / 2
    }px`;
    defaultTableData.BottomPlayer.left = ` ${
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
    const tableRef = doc(db, "tables", tableId);
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
            width: `${newData.scorePanel.leftTeam.name.width}%`,
            height: `${newData.scorePanel.leftTeam.name.height}px`,
          },
          score: {
            size: `${newData.scorePanel.leftTeam.score.size}px`,
            top: `${newData.scorePanel.leftTeam.score.top}px`,
            left: `${newData.scorePanel.leftTeam.score.left}px`,
            width: `${newData.scorePanel.leftTeam.score.width}%`,
            height: `${newData.scorePanel.leftTeam.score.height}px`,
          },
        },
        rightTeam: {
          name: {
            size: `${newData.scorePanel.rightTeam.name.size}px`,
            top: `${newData.scorePanel.rightTeam.name.top}px`,
            left: `${newData.scorePanel.rightTeam.name.left}px`,
            width: `${newData.scorePanel.rightTeam.name.width}%`,
            height: `${newData.scorePanel.rightTeam.name.height}px`,
          },
          score: {
            size: `${newData.scorePanel.rightTeam.score.size}px`,
            top: `${newData.scorePanel.rightTeam.score.top}px`,
            left: `${newData.scorePanel.rightTeam.score.left}px`,
            width: `${newData.scorePanel.rightTeam.score.width}%`,
            height: `${newData.scorePanel.rightTeam.score.height}px`,
          },
        },
        position:{
          scale: newData.scorePanel.position.scale, 
          left:`${newData.scorePanel.position.left}px`,
          top:`${newData.scorePanel.position.top}px`,
        }
      },
      LeftPlayer: {
        top: `${ newData.LeftPlayer.top }px`,
        left: `${newData.LeftPlayer.left}px`,
      },
      RightPlayer: {
        top: `${ newData.RightPlayer.top }px`,
        right: `${newData.RightPlayer.right}px`,
      },
      BottomPlayer: {
        bottom: `${newData.BottomPlayer.bottom}px`,
        left: ` ${ newData.BottomPlayer.left}px`,
      },
      DetailScoreColor: newData.DetailScoreColor,
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
