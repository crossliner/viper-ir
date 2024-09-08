# notes
- TBE means to be expanded
- finding control flow structures will not be directly done with the control flow graph rather with dominators

# todo list for luau bytecode parsing
- [x] string table
- [ ] prototypes
    - [x] prototype parameters
    - [ ] typeinfo
    - [] code
    - [x] constants
    - [ ] debug symbols
- [ ] main container

# todo list for a middle level ir
- [ ] control flow 
    - [ ] basic blocks
    - [ ] control flow graph
    - [ ] control flow structuring
        - [ ] strongly connected components (useful to locate loops)
        - [ ] dominators
        - [ ] structures
            - [ ] if then else
            - [ ] if then
            - [ ] loops
                - [ ] while loop
                - [ ] for loop
- [ ] data flow (TBE)
    - [ ] static single assignment