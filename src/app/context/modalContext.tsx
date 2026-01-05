'use client'
import { Menu } from "@/types";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface ModalContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>
  openModal: (menu: Menu) => void;
  closeModal: () => void;
  selectedItem: Menu | null;
}
const ModalContext = createContext<ModalContextType | undefined>(undefined);
export const ModalProvider = ({ children }: { children: ReactNode }) => {

  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Menu | null>(null)

  const openModal = (menu: Menu) => {
    setIsOpen(true)
    setSelectedItem(menu)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedItem(null)
  }

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen, openModal, closeModal, selectedItem }}>
      {children}
    </ModalContext.Provider>
  )
}


// ✅カスタムフックスの条件
// state を使う
// JSXを返さないことが多い
// レンダリングに関与する
// 関数に非常によく似ている

// ✅カスタムフックとは
// Reactのレンダリングサイクルに参加するロジックを、
// 通常の関数の形で再利用可能にしたもの

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalはModalProvider内で使用する必要があります。')
  }

  return context
}