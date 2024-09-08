/** Undirected, acyclic graph where each node can only have a singular parent */
export class TreeNode<T> {
	private parent: TreeNode<T> | null = null;
	private children = new Set<TreeNode<T>>();

	public constructor(private value: T) {}

	public getValue(): T {
		return this.value;
	}

	public getParent(): TreeNode<T> | null {
		return this.parent;
	}

	public getChildren(): Set<TreeNode<T>> {
		return this.children;
	}

	public setValue(newValue: T) {
		this.value = newValue;
	}

	public setParent(newParent: TreeNode<T> | null) {
		if (this.parent !== null) {
			this.parent.children.delete(this);
		}

		this.parent = newParent;
		if (newParent !== null) {
			newParent.addChildUnchecked(this);
		}
	}

	public addChild(child: TreeNode<T>) {
		child.setParent(this);
	}

	private addChildUnchecked(child: TreeNode<T>) {
		this.children.add(child);
	}
}
