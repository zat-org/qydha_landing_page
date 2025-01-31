import { useFirestore } from "vuefire";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
interface TableData {
  id: string;
  scoreMarginTop: string;
  LeftPlayer: { top: string; left: string };
  RightPlayer: { top: string; right: string };
  BottomPlayer: { bottom: string; left: string };
  PlayerImageWidth: number;
  DetailScoreColor: string;
}
interface TableUpdate {
  scoreMarginTop: number;
  LeftPlayer: number;
  RightPlayer: number;
  BottomPlayer: number;
  PlayerImageWidth: number;
  DetailScoreColor: string;
}
export const useBoardFB = () => {
  const db = useFirestore();

  const getOrCreateTable = async (tableId: string): Promise<TableData> => {
    const tableRef = doc(db, "tables", tableId);
    const tableSnap = await getDoc(tableRef);

    if (tableSnap.exists()) {
      return {
        ...(tableSnap.data() as TableData),
      };
    }

    // Create new document if it doesn't exist
    await setDoc(tableRef, {
      id: tableId,
      PlayerImageWidth: 60,
      scoreMarginTop: "0px",
      LeftPlayer: { top: "calc(50% - 30px)", left: "0px" },
      RightPlayer: { top: "calc(50% - 30px)", right: "0px" },
      BottomPlayer: { bottom: "0px", left: "calc(50% - 30px)" },
      DetailScoreColor: "#000000",
    });
    return {
      id: tableId,
      PlayerImageWidth: 60,
      scoreMarginTop: "0px",
      LeftPlayer: { top: "calc(50% - 30px)", left: "0px" },
      RightPlayer: { top: "calc(50% - 30px)", right: "0px" },
      BottomPlayer: { bottom: "0px", left: "calc(50% - 30px)" },
      DetailScoreColor: "#000000",
    };
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
      DetailScoreColor: newData.DetailScoreColor,
      scoreMarginTop: `${newData.scoreMarginTop}px`,
      LeftPlayer: {
        top: `calc(50% - ${newData.PlayerImageWidth / 2}px)`,
        left: `${newData.LeftPlayer}px`,
      },
      RightPlayer: {
        top: `calc(50% - ${newData.PlayerImageWidth / 2}px)`,
        right: `${newData.RightPlayer}px`,
      },
      BottomPlayer: {
        bottom: `${newData.BottomPlayer}px`,
        left: `calc(50% - ${newData.PlayerImageWidth / 2}px)`,
      },
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
