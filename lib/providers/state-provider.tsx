'use client';

import React, {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { usePathname } from 'next/navigation';


interface AppState {
  
}

type Action =
  | {
      type: 'ADD_EVENT';
      payload: any;
    }

const initialState: AppState = { };

const appReducer = (
  state: AppState = initialState,
  action: Action
): AppState => {
  switch (action.type) {
  //  case 'ADD_WORKSPACE':
  //    return {
  //      ...state,
  //      workspaces: [...state.workspaces, action.payload],
  //    };
  //  case 'DELETE_WORKSPACE':
  //    return {
  //      ...state,
  //      workspaces: state.workspaces.filter(
  //        (workspace) => workspace.id !== action.payload
  //      ),
  //    };
  //  case 'UPDATE_WORKSPACE':
  //    return {
  //      ...state,
  //      workspaces: state.workspaces.map((workspace) => {
  //        if (workspace.id === action.payload.workspaceId) {
  //          return {
  //            ...workspace,
  //            ...action.payload.workspace,
  //          };
  //        }
  //        return workspace;
  //      }),
  //    };
  //  case 'SET_WORKSPACES':
  //    return {
  //      ...state,
  //      workspaces: action.payload.workspaces,
  //    };
  //  case 'SET_FOLDERS':
  //    return {
  //      ...state,
  //      workspaces: state.workspaces.map((workspace) => {
  //        if (workspace.id === action.payload.workspaceId) {
  //          return {
  //            ...workspace,
  //            folders: action.payload.folders.sort(
  //              (a, b) =>
  //                new Date(a.createdAt).getTime() -
  //                new Date(b.createdAt).getTime()
  //            ),
  //          };
  //        }
  //        return workspace;
  //      }),
  //    };
  //  case 'ADD_FOLDER':
  //    return {
  //      ...state,
  //      workspaces: state.workspaces.map((workspace) => {
  //        return {
  //          ...workspace,
  //          folders: [...workspace.folders, action.payload.folder].sort(
  //            (a, b) =>
  //              new Date(a.createdAt).getTime() -
  //              new Date(b.createdAt).getTime()
  //          ),
  //        };
  //      }),
  //    };
  //  case 'UPDATE_FOLDER':
  //    return {
  //      ...state,
  //      workspaces: state.workspaces.map((workspace) => {
  //        if (workspace.id === action.payload.workspaceId) {
  //          return {
  //            ...workspace,
  //            folders: workspace.folders.map((folder) => {
  //              if (folder.id === action.payload.folderId) {
  //                return { ...folder, ...action.payload.folder };
  //              }
  //              return folder;
  //            }),
  //          };
  //        }
  //        return workspace;
  //      }),
  //    };
  //  case 'DELETE_FOLDER':
  //    return {
  //      ...state,
  //      workspaces: state.workspaces.map((workspace) => {
  //        if (workspace.id === action.payload.workspaceId) {
  //          return {
  //            ...workspace,
  //            folders: workspace.folders.filter(
  //              (folder) => folder.id !== action.payload.folderId
  //            ),
  //          };
  //        }
  //        return workspace;
  //      }),
  //    };
  //  case 'SET_FILES':
  //    return {
  //      ...state,
  //      workspaces: state.workspaces.map((workspace) => {
  //        if (workspace.id === action.payload.workspaceId) {
  //          return {
  //            ...workspace,
  //            folders: workspace.folders.map((folder) => {
  //              if (folder.id === action.payload.folderId) {
  //                return {
  //                  ...folder,
  //                  files: action.payload.files,
  //                };
  //              }
  //              return folder;
  //            }),
  //          };
  //        }
  //        return workspace;
  //      }),
  //    };
  //  case 'ADD_FILE':
  //    return {
  //      ...state,
  //      workspaces: state.workspaces.map((workspace) => {
  //        if (workspace.id === action.payload.workspaceId) {
  //          return {
  //            ...workspace,
  //            folders: workspace.folders.map((folder) => {
  //              if (folder.id === action.payload.folderId) {
  //                return {
  //                  ...folder,
  //                  files: [...folder.files, action.payload.file].sort(
  //                    (a, b) =>
  //                      new Date(a.createdAt).getTime() -
  //                      new Date(b.createdAt).getTime()
  //                  ),
  //                };
  //              }
  //              return folder;
  //            }),
  //          };
  //        }
  //        return workspace;
  //      }),
  //    };
  //  case 'DELETE_FILE':
  //    return {
  //      ...state,
  //      workspaces: state.workspaces.map((workspace) => {
  //        if (workspace.id === action.payload.workspaceId) {
  //          return {
  //            ...workspace,
  //            folder: workspace.folders.map((folder) => {
  //              if (folder.id === action.payload.folderId) {
  //                return {
  //                  ...folder,
  //                  files: folder.files.filter(
  //                    (file) => file.id !== action.payload.fileId
  //                  ),
  //                };
  //              }
  //              return folder;
  //            }),
  //          };
  //        }
  //        return workspace;
  //      }),
  //    };
  //  case 'UPDATE_FILE':
  //    return {
  //      ...state,
  //      workspaces: state.workspaces.map((workspace) => {
  //        if (workspace.id === action.payload.workspaceId) {
  //          return {
  //            ...workspace,
  //            folders: workspace.folders.map((folder) => {
  //              if (folder.id === action.payload.folderId) {
  //                return {
  //                  ...folder,
  //                  files: folder.files.map((file) => {
  //                    if (file.id === action.payload.fileId) {
  //                      return {
  //                        ...file,
  //                        ...action.payload.file,
  //                      };
  //                    }
  //                    return file;
  //                  }),
  //                };
  //              }
  //              return folder;
  //            }),
  //          };
  //        }
  //        return workspace;
  //      }),
  //    };
    default:
      return initialState;
  }
};

const AppStateContext = createContext<
  | {
      state: AppState;
      dispatch: Dispatch<Action>;
    }
  | undefined
>(undefined);

interface AppStateProviderProps {
  children: React.ReactNode;
}

const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const pathname = usePathname();

  //const workspaceId = useMemo(() => {
  //  const urlSegments = pathname?.split('/').filter(Boolean);
  //  if (urlSegments)
  //    if (urlSegments.length > 1) {
  //      return urlSegments[1];
  //    }
  //}, [pathname]);
//
  //const folderId = useMemo(() => {
  //  const urlSegments = pathname?.split('/').filter(Boolean);
  //  if (urlSegments)
  //    if (urlSegments?.length > 2) {
  //      return urlSegments[2];
  //    }
  //}, [pathname]);
//
  //const fileId = useMemo(() => {
  //  const urlSegments = pathname?.split('/').filter(Boolean);
  //  if (urlSegments)
  //    if (urlSegments?.length > 3) {
  //      return urlSegments[3];
  //    }
  //}, [pathname]);
//
  //useEffect(() => {
  //  if (!folderId || !workspaceId) return;
  //  const fetchFiles = async () => {
  //    const { error: filesError, data } = await getFiles(folderId);
  //    if (filesError) {
  //      console.log(filesError);
  //    }
  //    if (!data) return;
  //    dispatch({
  //      type: 'SET_FILES',
  //      payload: { workspaceId, files: data, folderId },
  //    });
  //  };
  //  fetchFiles();
  //}, [folderId, workspaceId]);
//
  useEffect(() => {
    console.log('App State Changed', state);
  }, [state]);

  return (
    <AppStateContext.Provider
      value={{ state, dispatch }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
