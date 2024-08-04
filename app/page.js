'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Typography, Modal, TextField, Stack, Button } from '@mui/material'
import { deleteDoc, doc, setDoc, getDoc, collection, query, getDocs } from 'firebase/firestore'

export default function Home() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [addItemName, setAddItemName] = useState('')
    const [searchItemName, setSearchItemName] = useState('')
    const [searchResults, setSearchResults] = useState(null)

    const updateInventory = async () => {
        const q = query(collection(firestore, 'inventory'))
        const snapshot = await getDocs(q)
        const inventoryList = []
        snapshot.forEach((doc) => {
            inventoryList.push({ name: doc.id, ...doc.data() })
        })
        setInventory(inventoryList)
    }

    const removeItem = async (item) => {
        const docRef = doc(firestore, 'inventory', item)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            if (quantity === 1) {
                await deleteDoc(docRef)
            } else {
                await setDoc(docRef, { quantity: quantity - 1 }, { merge: true })
            }
        }
        await updateInventory()
    }

    const removeAllItems = async () => {
        try {
            const q = query(collection(firestore, 'inventory'));
            const snapshot = await getDocs(q);
            
            for (const docSnapshot of snapshot.docs) {
                const docRef = doc(firestore, 'inventory', docSnapshot.id);
                await deleteDoc(docRef);
            }
    
            console.log('All items removed successfully.');
        } catch (error) {
            console.error('Error removing items: ', error);
        }
        await updateInventory();
    }

    const search = async (item) => {
        const docRef = doc(firestore, 'inventory', item)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            setSearchResults({ name: item, quantity })
        } else {
            setSearchResults({ name: item, quantity: 'not found' })
        }
    }

    const addItem = async (item) => {
        const docRef = doc(firestore, 'inventory', item)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            await setDoc(docRef, { quantity: quantity + 1 }, { merge: true })
        } else {
            await setDoc(docRef, { quantity: 1 })
        }

        await updateInventory()
    }

    useEffect(() => {
        updateInventory()
    }, [])

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
        background: '#ffffff',
        outline: 'none'
    }

    const headerStyle = {
        width: '100%',
        height: '120px',
        backgroundColor: '#333',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        borderRadius: '4px 4px 0 0',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
    }

    const inventoryItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            sx={{ background: '#f5f5f5', padding: '20px' }}
        >
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                        Add Item
                    </Typography>
                    <Stack width="100%" direction="row" spacing={2} mb={3}>
                        <TextField
                            label="Item"
                            variant="outlined"
                            fullWidth
                            value={addItemName}
                            onChange={(e) => setAddItemName(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                addItem(addItemName)
                                setAddItemName('')
                                handleClose()
                            }}
                        >
                            Add
                        </Button>
                    </Stack>
                    <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                        Search Item
                    </Typography>
                    <Stack width="100%" direction="row" spacing={2} mb={3}>
                        <TextField
                            label="Item"
                            variant="outlined"
                            fullWidth
                            value={searchItemName}
                            onChange={(e) => setSearchItemName(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                search(searchItemName)
                                setSearchItemName('')
                                handleClose()
                            }}
                        >
                            Search
                        </Button>
                    </Stack>
                    {searchResults && (
                        <Box mt={2}>
                            <Typography variant="h6">
                                Search Results:
                            </Typography>
                            <Typography>
                                {searchResults.name.charAt(0).toUpperCase() + searchResults.name.slice(1)}: {searchResults.quantity}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Modal>
            <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
                Add New Item
            </Button>
            <Box border="3px solid #333" borderRadius="8px" mt={2} sx={{ overflow: 'hidden' }}>
                <Box sx={headerStyle}>
                    <Typography variant="h2" color="white" textAlign="center" fontFamily="Oswald">
                        Inventory Items
                    </Typography>
                </Box>
                <Stack width="800px" height="300px" spacing={2} overflow="auto" sx={{ padding: '20px' }}>
                    {inventory.map(({ name, quantity }) => (
                        <Box
                            key={name}
                            sx={inventoryItemStyle}
                        >
                            <Typography variant="h5" color="#333">
                                {name.charAt(0).toUpperCase() + name.slice(1)}
                            </Typography>
                            <Typography variant="h5" color="#333">
                                Quantity: {quantity}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" color="primary" onClick={() => addItem(name)}>
                                    Add
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => removeItem(name)}>
                                    Remove
                                </Button>
                                <Button variant="contained" color="error" onClick={() => removeAllItems(name)}>
                                    Remove All
                                </Button>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    )
}
