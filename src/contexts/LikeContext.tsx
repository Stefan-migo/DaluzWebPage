'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface LikeContextType {
  likedProducts: Set<string>
  toggleLike: (productId: string) => Promise<void>
  isLiked: (productId: string) => boolean
  isLoading: boolean
  error: string | null
}

const LikeContext = createContext<LikeContextType | undefined>(undefined)

interface LikeProviderProps {
  children: ReactNode
}

const LIKED_PRODUCTS_KEY = 'daluz-liked-products'

export function LikeProvider({ children }: LikeProviderProps) {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Load liked products on mount
  useEffect(() => {
    loadLikedProducts()
  }, [user])

  const loadLikedProducts = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (user) {
        console.log('Loading favorites for user:', user.id)
        // Check if user is properly authenticated
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          console.log('No active session, falling back to localStorage')
          const stored = localStorage.getItem(LIKED_PRODUCTS_KEY)
          if (stored) {
            try {
              const productIds = JSON.parse(stored)
              setLikedProducts(new Set(productIds))
            } catch (parseError) {
              console.error('Error parsing stored favorites:', parseError)
              localStorage.removeItem(LIKED_PRODUCTS_KEY)
            }
          }
          return
        }
        
        // Load from database for authenticated users
        const { data, error: dbError } = await supabase
          .from('user_favorites')
          .select('product_id')
          .eq('user_id', user.id)

        if (dbError) {
          console.error('Error loading favorites from database:', dbError)
          // If table doesn't exist, fall back to localStorage
          if (dbError.code === '42P01') {
            console.log('user_favorites table not found, falling back to localStorage')
            const stored = localStorage.getItem(LIKED_PRODUCTS_KEY)
            if (stored) {
              try {
                const productIds = JSON.parse(stored)
                setLikedProducts(new Set(productIds))
              } catch (parseError) {
                console.error('Error parsing stored favorites:', parseError)
                localStorage.removeItem(LIKED_PRODUCTS_KEY)
              }
            }
            return
          }
          setError('Error loading favorites')
          return
        }

        const productIds = data?.map(item => item.product_id) || []
        setLikedProducts(new Set(productIds))
      } else {
        // Load from localStorage for guest users
        const stored = localStorage.getItem(LIKED_PRODUCTS_KEY)
        if (stored) {
          try {
            const productIds = JSON.parse(stored)
            setLikedProducts(new Set(productIds))
          } catch (parseError) {
            console.error('Error parsing stored favorites:', parseError)
            localStorage.removeItem(LIKED_PRODUCTS_KEY)
          }
        }
      }
    } catch (err) {
      console.error('Error loading liked products:', err)
      setError('Error loading favorites')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLike = async (productId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const isCurrentlyLiked = likedProducts.has(productId)
      const newLikedProducts = new Set(likedProducts)

      if (isCurrentlyLiked) {
        // Unlike the product
        newLikedProducts.delete(productId)
        
        if (user) {
          // Check if user is properly authenticated
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) {
            console.log('No active session, falling back to localStorage')
            const productIds = Array.from(newLikedProducts)
            localStorage.setItem(LIKED_PRODUCTS_KEY, JSON.stringify(productIds))
            setLikedProducts(newLikedProducts)
            return
          }
          
          // Remove from database
          const { error: dbError } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId)

          if (dbError) {
            console.error('Error removing favorite from database:', dbError)
            // If table doesn't exist, fall back to localStorage
            if (dbError.code === '42P01') {
              console.log('user_favorites table not found, using localStorage only')
              const productIds = Array.from(newLikedProducts)
              localStorage.setItem(LIKED_PRODUCTS_KEY, JSON.stringify(productIds))
              setLikedProducts(newLikedProducts)
              return
            }
            setError('Error removing favorite')
            return
          }
        } else {
          // Remove from localStorage
          const productIds = Array.from(newLikedProducts)
          localStorage.setItem(LIKED_PRODUCTS_KEY, JSON.stringify(productIds))
        }
      } else {
        // Like the product
        newLikedProducts.add(productId)
        
        if (user) {
          console.log('Adding favorite to database for user:', user.id, 'product:', productId)
          // Check if user is properly authenticated
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) {
            console.log('No active session, falling back to localStorage')
            const productIds = Array.from(newLikedProducts)
            localStorage.setItem(LIKED_PRODUCTS_KEY, JSON.stringify(productIds))
            setLikedProducts(newLikedProducts)
            return
          }
          
          // Add to database
          const { error: dbError } = await supabase
            .from('user_favorites')
            .insert({
              user_id: user.id,
              product_id: productId,
              created_at: new Date().toISOString()
            })

          if (dbError) {
            console.error('Error adding favorite to database:', dbError)
            // If table doesn't exist, fall back to localStorage
            if (dbError.code === '42P01') {
              console.log('user_favorites table not found, using localStorage only')
              const productIds = Array.from(newLikedProducts)
              localStorage.setItem(LIKED_PRODUCTS_KEY, JSON.stringify(productIds))
              setLikedProducts(newLikedProducts)
              return
            }
            setError('Error adding favorite')
            return
          }
        } else {
          // Add to localStorage
          const productIds = Array.from(newLikedProducts)
          localStorage.setItem(LIKED_PRODUCTS_KEY, JSON.stringify(productIds))
        }
      }

      setLikedProducts(newLikedProducts)
    } catch (err) {
      console.error('Error toggling like:', err)
      setError('Error updating favorite')
    } finally {
      setIsLoading(false)
    }
  }

  const isLiked = (productId: string): boolean => {
    return likedProducts.has(productId)
  }

  const value: LikeContextType = {
    likedProducts,
    toggleLike,
    isLiked,
    isLoading,
    error
  }

  return (
    <LikeContext.Provider value={value}>
      {children}
    </LikeContext.Provider>
  )
}

export function useLike() {
  const context = useContext(LikeContext)
  if (context === undefined) {
    throw new Error('useLike must be used within a LikeProvider')
  }
  return context
}
